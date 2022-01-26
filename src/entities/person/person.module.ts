import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './person.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Person])],
    exports: [TypeOrmModule],
})
export class PersonModule {}