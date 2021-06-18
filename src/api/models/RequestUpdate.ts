import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CheckIn } from './CheckIn';
import { User } from './User';

export enum RequestStatus {
    Wating = 1,
    Approve = 2,
    Reject = 3,
}

@Entity()
@Index(["to", "status"])
export class RequestUpdate {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'note' })
    public note: string;

    @Column({ name: 'status'})
    public status: number;

    @Column({type: 'timestamp', name: 'update_from'})
    public updateFrom: Date;

    @Column({type: 'timestamp', name: 'update_to'})
    public updateTo: Date;

    @ManyToOne(() => CheckIn)
    public checkIn: CheckIn;

    @ManyToOne(() => User)
    @JoinColumn({ name: "from" })
    public from: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: "to" })
    public to: User;
}
