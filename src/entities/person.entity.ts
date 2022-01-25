import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn, Index,
} from 'typeorm';

@Entity()
export class Person {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    source: string;

    @Column()
    sourceUserId: string;

    @Column()
    @Index()
    goldenRecordId: string;

    @Column()
    @Index()
    fetchStatus: string;

    @Column("json")
    fetchErrors: object;

    @Column("json")
    rawData: object;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}