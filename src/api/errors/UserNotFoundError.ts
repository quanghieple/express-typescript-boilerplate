import { HttpError } from 'routing-controllers';

export class UserNotFoundError extends HttpError {
    constructor() {
        super(404, 'User not found!');
    }
}

export class ObjectNotFoundError extends HttpError {
    constructor() {
        super(200, "");
    }
}
