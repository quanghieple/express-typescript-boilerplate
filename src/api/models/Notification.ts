import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

export enum NotiStatus {
    Unread = 1,
    Readed = 2,
}

@Entity()
@Index(["to", "status"])
export class Notification {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: 'json', nullable: true })
    public data: any;

    @Column({ name: 'message' })
    public msg: string;

    @Column({ name: 'status'})
    public status: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "from" })
    public from: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: "to" })
    public to: User;
}
