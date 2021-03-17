import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CheckArea } from '../object/CheckArea';
import { User } from './User';

@Entity()
export class Setting {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'json'})
    public location: CheckArea[];

    @ManyToOne(() => User)
    public user: User;
}
