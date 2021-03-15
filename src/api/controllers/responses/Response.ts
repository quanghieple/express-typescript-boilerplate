export class Response {
    public code: number;
    public msg: number;
    public data: any;

    constructor(code: number, msg: number, data: any) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
}

export const success = (data: any, msg: number = 0): Response => {
    return new Response(1, msg, data);
};

export const fail = (msg: number, data: any = undefined): Response => {
    return new Response(0, msg, data);
};
