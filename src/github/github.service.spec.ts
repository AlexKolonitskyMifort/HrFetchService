import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import axios from "axios";
import { Repository } from 'typeorm';

import { GitHubSearchPage, GitHubUser, GitHubUserFull } from '@type/GitHub';
import { SourceEnum } from '@type/enums';

import { GitHubService } from './github.service';
import { Person } from '../entities/person/person.entity';

const userResults: GitHubUserFull[] = [{
  "login": "user1",
  "id": "1",
  "node_id": "node_id_1",
  "avatar_url": "avatar_id_1",
  "gravatar_id": "",
  "url": "url_user1",
  "html_url": "html_url_user1",
  "followers_url": "url_user1/followers",
  "following_url": "url_user1/following{/other_user}",
  "gists_url": "url_user1/gists{/gist_id}",
  "starred_url": "url_user1/starred{/owner}{/repo}",
  "subscriptions_url": "url_user1/subscriptions",
  "organizations_url": "url_user1/orgs",
  "repos_url": "url_user1/repos",
  "events_url": "url_user1/events{/privacy}",
  "received_events_url": "url_user1/received_events",
  "type": "User",
  "site_admin": false,
  "name": "User One",
  "company": null,
  "blog": "",
  "location": "",
  "email": null,
  "hireable": null,
  "bio": null,
  "twitter_username": null,
  "public_repos": 0,
  "public_gists": 0,
  "followers": 0,
  "following": 0,
  "created_at": "2022-01-28T09:25:07Z",
  "updated_at": "2022-01-28T09:25:07Z",
}, {
  "login": "user2",
  "id": "2",
  "node_id": "node_id_2",
  "avatar_url": "avatar_id_2",
  "gravatar_id": "",
  "url": "url_user2",
  "html_url": "html_url_user2",
  "followers_url": "url_user2/followers",
  "following_url": "url_user2/following{/other_user}",
  "gists_url": "url_user2/gists{/gist_id}",
  "starred_url": "url_user2/starred{/owner}{/repo}",
  "subscriptions_url": "url_user2/subscriptions",
  "organizations_url": "url_user2/orgs",
  "repos_url": "url_user2/repos",
  "events_url": "url_user2/events{/privacy}",
  "received_events_url": "url_user2/received_events",
  "type": "User",
  "site_admin": false,
  "name": "User One",
  "company": null,
  "blog": "",
  "location": "",
  "email": null,
  "hireable": null,
  "bio": null,
  "twitter_username": null,
  "public_repos": 0,
  "public_gists": 0,
  "followers": 0,
  "following": 0,
  "created_at": "2022-01-28T09:25:07Z",
  "updated_at": "2022-01-28T09:25:07Z",
}];

const searchResult: GitHubSearchPage<GitHubUser> = {
  total_count: 2,
  incomplete_results: false,
  items: userResults,
};

describe('GitHubService', () => {
  let service: GitHubService;
  let repository: Repository<Person>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GitHubService,
        ConfigService,
        {
          provide: getRepositoryToken(Person),
          useClass: Repository,
        }
      ]
    }).compile();

    service = module.get<GitHubService>(GitHubService);
    repository = module.get<Repository<Person>>(getRepositoryToken(Person));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAll', () => {
    it('should fetch and save users', async () => {
      jest.mock('axios', () => ({
        get: jest.fn()
            .mockResolvedValue({ data: userResults })
            .mockResolvedValueOnce({ data: searchResult})
      }));
      const axiosSpy = jest.spyOn(axios, 'get');
      const repoFindSpy = jest.spyOn(repository, 'findOne').mockResolvedValue(new Person());
      const repoUpsertSpy = jest.spyOn(repository, 'upsert').mockResolvedValue({
        identifiers: [],
        generatedMaps: [],
        raw: null,
      });

      await service.fetchAll();

      expect(axiosSpy).toHaveBeenCalledTimes(3);
      expect(repoFindSpy).toHaveBeenCalledWith({
        source: SourceEnum.GitHub,
        sourceId: userResults[0].id,
      });
      expect(repoFindSpy).toHaveBeenCalledWith({
        source: SourceEnum.GitHub,
        sourceId: userResults[1].id,
      });
      expect(repoUpsertSpy).toHaveBeenCalledWith({
        source: SourceEnum.GitHub,
        sourceId: userResults[0].id,
        rawData: userResults[0],
      });
      expect(repoUpsertSpy).toHaveBeenCalledWith({
        source: SourceEnum.GitHub,
        sourceId: userResults[1].id,
        rawData: userResults[1],
      });

      jest.unmock('axios');
      axiosSpy.mockRestore();
      repoFindSpy.mockRestore();
      repoUpsertSpy.mockRestore();
    })
  });
});
