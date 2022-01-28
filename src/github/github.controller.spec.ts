import { Test, TestingModule } from '@nestjs/testing';

import { GitHubController } from './github.controller';
import { GitHubService } from './github.service';

describe('GitHubController', () => {
  let controller: GitHubController;
  let service: GitHubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GitHubController],
      providers: [
        {
          provide: GitHubService,
          useValue: {
            fetchAll: jest.fn(),
          }
        }
      ],
    }).compile();

    controller = module.get<GitHubController>(GitHubController);
    service = module.get<GitHubService>(GitHubService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('fetch', () => {
    it('should call the fetchAll service method', async () => {
      const spy = jest.spyOn(service, 'fetchAll').mockImplementation(() => null);
      await controller.fetch();
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });
});
