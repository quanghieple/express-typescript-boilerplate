import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CheckArea } from '../object/CheckArea';
import { Shift } from './Shift';
import { User } from './User';

@Entity()
export class Setting {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'json'})
    public location: CheckArea[];

    @Column({type: 'json'})
    public shift: Shift[];

    @ManyToOne(() => User)
    public user: User;
}
