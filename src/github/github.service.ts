import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as querystring from 'querystring';
import axios, { AxiosInstance } from 'axios';
import axiosThrottle from 'axios-request-throttle';

import { GitHubSearchPage, GitHubUser, GitHubUserFull } from '@type/GitHub';
import { SourceEnum } from '@type/enums';

import { Person } from '../entities/person/person.entity';

const API_BASE_URL = 'https://api.github.com';
const API_URL_USER_LIST = '/search/users';
const API_URL_USER = '/users';

const QUERIES = [
    'language:Java+location:Belarus',
    'language:JavaScript+location:Belarus',
];

const PER_PAGE = 100;
const PAGE_COUNT = Math.ceil(1000 / PER_PAGE);
const REQUESTS_PER_SECOND = 16;
const DEFAULT_SEARCH_PARAMS = {
    type: 'Users',
    per_page: PER_PAGE,
};

@Injectable()
export class GitHubService {
    private readonly http: AxiosInstance;
    private readonly logger = new Logger(GitHubService.name);

    constructor(
        @InjectRepository(Person)
        private personRepository: Repository<Person>,
        private configService: ConfigService,
    ) {
        this.http = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                Authorization: `token ${configService.get('GITHUB_API_TOKEN')}`,
            },
        });
        axiosThrottle.use(this.http, { requestsPerSecond: REQUESTS_PER_SECOND });
    }

    async fetchAll() {
        this.logger.log("Fetch started");
        let newPersonCount = 0;
        let updatedPersonCount = 0;

        for (const q of QUERIES) {
            for (let page = 1; page <= PAGE_COUNT; page++) {
                try {
                    const { data } = await this.http.get<GitHubSearchPage<GitHubUser>>(
                        `${API_URL_USER_LIST}?${
                            querystring.stringify(
                                { 
                                    ...DEFAULT_SEARCH_PARAMS, 
                                    q, 
                                    page,
                                }, 
                                '&', 
                                '=', 
                                { 
                                    encodeURIComponent: encodeURI, 
                                },
                            )
                        }`,
                    );

                    page === 1 && this.logger.log(`Total amount of persons found: ${data.total_count}, query: ` + q);

                    for (const person of data.items) {
                        const personData = await this.fetch(person.login);
                        this.logger.log('Person: ' + JSON.stringify(personData));
                        const isNewPerson = await this.savePerson(personData);
                        isNewPerson ? newPersonCount++ : updatedPersonCount++;
                    }
                } catch (e) {
                    this.logger.error('An error occurred when trying to get persons with the following params:' +
                        `\n- query: ${q}` +
                        `\n- page: ${page}` +
                        `\n- error: ${e}`,
                    );
                }
            }
        }

        this.logger.log(`New person count: ${newPersonCount}`);
        this.logger.log(`Updated person count: ${updatedPersonCount}`);
    }

    async fetch(username: string) {
        try {
            const { data } = await this.http.get<GitHubUserFull>(`${API_URL_USER}/${username}`);
            return data;
        } catch (e) {
            this.logger.error('An error occurred when trying to get a user with the following params:' +
                `\n- username: ${username}` +
                `\n- error: ${e}`,
            );
        }
    }

    private async savePerson(person: GitHubUserFull): Promise<boolean> {
        const existingPerson = await this.personRepository.findOne({
            source: SourceEnum.GitHub,
            sourceId: person.id,
        });

        await this.personRepository.upsert({
            source: SourceEnum.GitHub,
            sourceId: person.id,
            rawData: person,
        }, ['source', 'sourceId']);

        return !existingPerson;
    }
}
