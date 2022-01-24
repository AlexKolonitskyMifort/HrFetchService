import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import * as querystring from "querystring";
import axios, { AxiosInstance } from "axios";
import { GitHubSearchPage, GitHubUser, GitHubUserFull } from "@type/GitHub";


const API_BASE_URL = "https://api.github.com";
const API_URL_USER_LIST = "/search/users";
const API_URL_USER = "/users";

const QUERIES = [
    "language:Java+location:Belarus",
    "language:JavaScript+location:Belarus",
];

const DEFAULT_SEARCH_PARAMS = {
    type: "Users",
    per_page: 100,
};

@Injectable()
export class GitHubService {
    private http: AxiosInstance;

    constructor(private configService: ConfigService) {
        this.http = axios.create({
            baseURL: API_BASE_URL,
        });
        this.http.defaults.headers.common['Authorization'] = `token ${configService.get('GITHUB_API_TOKEN')}`
    }

    async fetchAll() {
        for (const q of QUERIES) {
            for (let page = 1; page <= 10; page++) {
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

                    for (const user of data.items) {
                        const userData = await this.fetch(user.login);
                        console.log("User:", JSON.stringify(userData));
                    }
                } catch (e) {
                    console.log("An error occurred when trying to get users with the following params:",
                        `\n- query: ${q}`,
                        `\n- page: ${page}`,
                        `\n- error: ${e}`,
                    );
                }
            }
        }
    }

    async fetch(username: string) {
        try {
            const { data } = await this.http.get<GitHubUserFull>(`${API_URL_USER}/${username}`);
            return data;
        } catch (e) {
            console.log("An error occurred when trying to get a user with the following params:",
                `\n- username: ${username}`,
                `\n- error: ${e}`,
            );
        }
    }
}
