import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Person } from './entities/person/person.entity';
import { GithubModule } from './github/github.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
        }),
        TypeOrmModule.forRoot({
            entities: [Person],
        }),
        GithubModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
