import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleValue {
    Admin = 'Admin',
    Manager = 'Manager',
    User = 'User',
}
@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'role_name' })
    public name: string;

    @Column({ name: 'priority' })
    public priority: number;

    constructor(name: string = "", priority: number = 0) {
        this.name = name;
        this.priority = priority;
    }

    public withId(id: number): Role {
        this.id = id;
        return this;
    }

    public withName(name: string): Role {
        this.name = name;
        return this;
    }

    public withPriority(priority: number): Role {
        this.priority = priority;
        return this;
    }
}
