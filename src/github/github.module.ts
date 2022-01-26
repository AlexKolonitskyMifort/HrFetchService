import { Module } from '@nestjs/common';
import { GitHubController } from './github.controller';
import { GitHubService } from './github.service';
import { PersonModule } from '../entities/person/person.module';


@Module({
    imports: [PersonModule],
    controllers: [GitHubController],
    providers: [GitHubService],
})
export class GithubModule {}