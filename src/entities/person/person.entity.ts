import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { SourceEnum } from '@type/enums';

@Entity()
@Index(["source", "sourceId"], { unique: true })
export class Person {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    source: SourceEnum;

    @Column()
    sourceId: string;

    @Column({
        nullable: true,
    })
    @Index()
    goldenRecordId: string;

    @Column({
        nullable: true,
    })
    @Index()
    fetchStatus: string;

    @Column({
        type: 'json',
        nullable: true,
    })
    fetchErrors: object;

    @Column('json')
    rawData: object;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}