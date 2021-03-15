// UserController
class UserController {
    public readonly code = 1000;
    public readonly CREATE_MAIL_EXIST = this.code + 1;
    public readonly NOT_PARENT_UPDATE = this.code + 2;
}

export const UserError = new UserController();
