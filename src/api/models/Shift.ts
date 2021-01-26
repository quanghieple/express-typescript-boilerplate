import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Shift {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public start: number;

    @Column()
    public end: number;
}
