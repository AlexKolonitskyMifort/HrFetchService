import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitHubController } from './git-hub/git-hub.controller';
import { GitHubService } from './git-hub/git-hub.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.local', '.env'],
        }),
        TypeOrmModule.forRoot(),
    ],
    controllers: [AppController, GitHubController],
    providers: [AppService, GitHubService],
})
export class AppModule {}
