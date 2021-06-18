export class WorkShiftUpdate {
    public id: number;
    public checkId: number;
    public checkout: Date;
    public noteIn: string;
    public noteOut: string;
    public requestNote: string;
}

export class BaseCheckin {
    public id: number;
    public time: number;
    public shift: number;
    public data: any;
    public note: string;
}
