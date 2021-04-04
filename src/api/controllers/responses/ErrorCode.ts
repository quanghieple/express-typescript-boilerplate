// UserController
class UserController {
    public readonly code = 1000;
    public readonly CREATE_MAIL_EXIST = this.code + 1;
    public readonly NOT_PARENT_UPDATE = this.code + 2;
}

export const UserError = new UserController();

// CheckInController
class CheckInController {
    public readonly code = 2000;
    public readonly OUT_LOCATION = this.code + 1;
    public readonly ID_NOT_FOUND = this.code + 2;
    public readonly QR_TIMEOUT = this.code + 3;
    public readonly INVALID_TIME = this.code + 4;
    public readonly TIME_TIMEOUT = this.code + 3;
}
export const CheckInError = new CheckInController();

// HomeController
class HomeController {
    public readonly code = 0;
    public readonly INVALID_LOGIN = this.code + 1;
}
export const HomeError = new HomeController();
