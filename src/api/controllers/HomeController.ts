import { Body, JsonController, OnUndefined, Post } from 'routing-controllers';

import { AuthService } from '@/auth/AuthService';
import { Logger } from '@/lib/logger';

import { UserNotFoundError } from '../errors/UserNotFoundError';

@JsonController()
export class HomeController {
    private log = new Logger(__filename);

    constructor(private authService: AuthService) {}

    @Post('/login')
    @OnUndefined(UserNotFoundError)
    public async login(@Body() body: {username: string, password: string}): Promise<any> {
        const user = await this.authService.validateUser(body.username, body.password);
        if (user) {
            this.log.info(JSON.stringify(user));
            const token = this.authService.encryptJWT(user);
            return {user, token};
        }
        return undefined;
    }
}
