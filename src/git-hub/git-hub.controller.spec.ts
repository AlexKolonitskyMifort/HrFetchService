import { Test, TestingModule } from '@nestjs/testing';
import { GitHubController } from './git-hub.controller';

describe('GitHubController', () => {
  let controller: GitHubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GitHubController],
    }).compile();

    controller = module.get<GitHubController>(GitHubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
