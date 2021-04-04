import { Body, JsonController, OnUndefined, Post } from 'routing-controllers';

import { AuthService } from '@/auth/AuthService';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserService } from '../services/UserService';
import { HomeError } from './responses/ErrorCode';
import { fail, Response, success } from './responses/Response';

@JsonController()
export class HomeController {
    constructor(private userService: UserService, private authService: AuthService) {}

    @Post('/login')
    @OnUndefined(UserNotFoundError)
    public async login(@Body() body: {username: string, password: string}): Promise<Response> {
        const user = await this.userService.login(body.username, body.password);
        if (user) {
            const token = this.authService.encryptJWT(user);
            return success({user, token});
        } else {
            return fail(HomeError.INVALID_LOGIN);
        }
    }
}
