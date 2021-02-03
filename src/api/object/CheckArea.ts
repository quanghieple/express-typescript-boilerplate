import { Coord } from './Coord';

export class CheckArea {
    public coord: Coord;
    public name: string;
    public radius: number;

    constructor(coord: Coord, name: string, radius: number) {
        this.coord = coord;
        this.name = name;
        this.radius = radius;
    }
}
