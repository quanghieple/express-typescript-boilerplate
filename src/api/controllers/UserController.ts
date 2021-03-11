import { IsEmail, IsNotEmpty } from 'class-validator';
import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { User } from '../models/User';
import { UserService } from '../services/UserService';

class BaseUser {
    @IsNotEmpty()
    public name: string;

    public birth: Date;

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    public username: string;

    @IsNotEmpty()
    public phone: string;

    public photoURL: string;

    public address: string;

    public profile: string;
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
        private userService: UserService
    ) { }

    @Get('/me')
    @ResponseSchema(UserResponse)
    public findMe(@Req() req: any): Promise<User> {
        return this.userService.getFullUser(req.user.id);
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
        user.name = body.name;
        user.birth = body.birth;
        user.password = body.password;
        user.username = body.username;
        user.phone = body.phone;
        user.photoURL = body.photoURL;
        user.address = body.address;
        user.profile = body.profile;

        return this.userService.create(user);
    }

    @Put('/:id')
    @ResponseSchema(UserResponse)
    public async update(@Param('id') id: number, @Body() body: BaseUser): Promise<User> {
        const user = await this.userService.findOne(id);
        user.email = body.email || user.email;
        user.name = body.name || user.name;
        user.birth = body.birth || user.birth;
        user.username = body.username || user.username;
        user.phone = body.phone || user.phone;
        user.photoURL = body.photoURL || user.photoURL;
        user.address = body.address || user.address;
        user.profile = body.profile || user.profile;

        return this.userService.update(user);
    }

    @Put()
    @ResponseSchema(UserResponse)
    public async updateCurrent(@Body() body: BaseUser, @Req() req: any): Promise<User> {
        const user = await this.userService.findOne(req.user.id);
        user.name = body.name || user.name;
        user.birth = body.birth || user.birth;
        user.username = body.username || user.username;
        user.photoURL = body.photoURL || user.photoURL;
        user.address = body.address || user.address;
        user.profile = body.profile || user.profile;

        return this.userService.update(user);
    }

    @Delete('/:id')
    public delete(@Param('id') id: number): Promise<void> {
        return this.userService.delete(id);
    }
}
