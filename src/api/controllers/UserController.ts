import { IsEmail, IsNotEmpty} from 'class-validator';
import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { AuthService } from '../../auth/AuthService';

class BaseUser {
    @IsNotEmpty()
    public firstName: string;

    public lastName: string;

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    public username: string;

    @IsNotEmpty()
    public phone: string;
}

export class UserResponse extends BaseUser {
    public id: string;
}

export class LoginResponse {
    public token: string;
    public user: User;
}

class CreateUserBody extends BaseUser {
    @IsNotEmpty()
    public password: string;
}

@Authorized()
@JsonController('/users')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class UserController {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    @Get('/me')
    @ResponseSchema(UserResponse, { isArray: true })
    public findMe(@Req() req: any): Promise<User[]> {
        return req.user;
    }

    @Get('/:id')
    @OnUndefined(UserNotFoundError)
    @ResponseSchema(UserResponse)
    public one(@Param('id') id: number): Promise<User | undefined> {
        return this.userService.findOne(id);
    }

    @Post()
    @ResponseSchema(UserResponse)
    public create(@Body() body: CreateUserBody): Promise<User> {
        const user = new User();
        user.email = body.email;
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.password = body.password;
        user.username = body.username;
        user.phone = body.phone;

        return this.userService.create(user);
    }

    @Put('/:id')
    @ResponseSchema(UserResponse)
    public update(@Param('id') id: number, @Body() body: BaseUser): Promise<User> {
        const user = new User();
        user.email = body.email;
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.username = body.username;
        user.phone = body.phone;
        user.id = id;

        return this.userService.update(user);
    }

    @Delete('/:id')
    public delete(@Param('id') id: number): Promise<void> {
        return this.userService.delete(id);
    }

    @Post('/login')
    public async login(@Body() body: {username: string, password: string}): Promise<any> {
        const user = await this.authService.validateUser(body.username, body.password);
        if (user) {
            const token = this.authService.encodeJWT(user);
            return {user, token};
        }
        return undefined;
    }

}
