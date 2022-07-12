import { Controller, Get } from '@nestjs/common';
import { GitHubService } from './github.service';

@Controller('github')
export class GitHubController {
    constructor(private githubService: GitHubService) {}

    @Get()
    async fetch() {
        this.githubService.fetchAll(); // Hello
    }
}
