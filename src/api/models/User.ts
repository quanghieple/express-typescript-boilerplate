import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
    BeforeInsert, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { Role } from './Role';

@Entity()
export class User {

    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    public static comparePassword(user: User, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                resolve(res === true);
            });
        });
    }

    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @Column({type: "timestamp"})
    public birth: Date;

    @IsNotEmpty()
    @Column()
    public email: string;

    @IsNotEmpty()
    @Column()
    @Exclude()
    public password: string;

    @IsNotEmpty()
    @Column()
    @Index()
    public username: string;

    @IsNotEmpty()
    @Column()
    @Index()
    public phone: string;

    @Column({default: ""})
    public address: string;

    @Column({default: ""})
    public profile: string;

    @Column({default: false})
    public disabled: boolean;

    @Column({default: ""})
    public photoURL: string;

    @ManyToOne(() => Role)
    public role: Role;

    @ManyToOne(() => User)
    public parent: User;

    @CreateDateColumn({type: "timestamp"})
    public created: Date;

    @UpdateDateColumn({type: "timestamp"})
    public modified: Date;

    public toString(): string {
        return `${this.name} ${this.email}`;
    }

    @BeforeInsert()
    public async hashPassword(): Promise<void> {
        this.password = await User.hashPassword(this.password);
    }

    public withId(id: number): User {
        this.id = id;
        return this;
    }

    public setRole(role: Role, parent: any): void {
        if (role.priority > parent.priority) {
            this.role = (new Role()).withId(parent.id);
        } else {
            this.role = role;
        }
    }

}
