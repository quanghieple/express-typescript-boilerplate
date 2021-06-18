import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Shift } from './Shift';
import { User } from './User';

export enum CheckinStatus {
    Checkin = 1,
    Checkout = 2,
    forgot = 3,
}
@Entity()
@Index(["month", "user"])
export class CheckIn {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'timestamp'})
    public inn: Date;

    @Column({type: 'timestamp'})
    public out: Date;

    @Index()
    @Column()
    public status: number;

    @Index()
    @Column()
    public month: string;

    @Column()
    public date: number;

    @Column({default: ""})
    public noteIn: string;

    @Column({default: ""})
    public noteOut: string;

    @ManyToOne(() => User)
    public user: User;

    @ManyToOne(() => Shift)
    public shift: Shift;

    constructor(time: number, user: User, shift: Shift, note: string) {
        const date = new Date(time);
        this.inn = date;
        this.out = new Date();
        this.status = CheckinStatus.Checkin;
        this.user = user;
        this.shift = shift;
        this.noteIn = note;
        this.date = date.getDate();
        this.month = date.getMonth() + "-" + date.getFullYear();
    }
}
