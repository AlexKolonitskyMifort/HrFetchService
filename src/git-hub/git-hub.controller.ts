import { Controller, Get } from '@nestjs/common';
import { GitHubService } from "./git-hub.service";

@Controller('git-hub')
export class GitHubController {
    constructor(private githubService: GitHubService) {}

    @Get()
    async fetch() {
        this.githubService.fetchAll();
    }
}
