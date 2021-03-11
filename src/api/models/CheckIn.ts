import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Shift } from './Shift';
import { User } from './User';

@Entity()
export class CheckIn {

    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column({type: 'timestamp'})
    public time: Date;

    @Index()
    @Column()
    public week: string;

    @ManyToOne(() => User)
    public user: User;

    @ManyToOne(() => Shift)
    public shift: Shift;
}
