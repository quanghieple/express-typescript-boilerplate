import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'role_name' })
    public name: string;

    constructor(name: string) {
        this.name = name;
    }
}
