import { Column, Entity, Index, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Geo {
    @PrimaryColumn()
    public id: number;

    @Index()
    @Column()
    public name: string;

    @Index()
    @Column({default: ""})
    public label: string;

    @OneToOne(() => Geo)
    public parent: Geo;

    constructor(id: number, name: string, label: string, parent: Geo) {
        this.id = id;
        this.name = name;
        this.label = label;
        this.parent = parent;
    }
}
