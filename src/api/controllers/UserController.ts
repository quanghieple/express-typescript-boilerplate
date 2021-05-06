import { IsEmail, IsNotEmpty } from 'class-validator';
import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { Role } from '../models/Role';
import { Setting } from '../models/Setting';
import { User } from '../models/User';
import { CheckArea } from '../object/CheckArea';
import { UserService } from '../services/UserService';
import { UserError } from './responses/ErrorCode';
import { fail, Response, success } from './responses/Response';

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

    public role: number;
}

export class UserResponse extends BaseUser {
    public id: string;
}

export class LoginResponse {
    public token: string;
    public user: User;
}

export class CreateUserBody extends BaseUser {
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
    @ResponseSchema(Response)
    public async create(@Body() body: CreateUserBody, @Req() req: any): Promise<Response> {
        const checkEmail = await this.userService.countByEmail(body.email);
        if (checkEmail > 0) {
            return fail(UserError.CREATE_MAIL_EXIST);
        } else {
            return this.userService.create(body, req.user).then(user => success(user));
        }
    }

    @Put('/:id')
    @ResponseSchema(UserResponse)
    public async update(@Param('id') id: number, @Body() body: BaseUser, @Req() req: any): Promise<Response> {
        const user = await this.userService.getFullUser(id);
        if (user.parent.id !== req.user.id) {
            return fail(UserError.NOT_PARENT_UPDATE);
        } else {
            return this.userService.update(user, body).then((u) => success(u));
        }
    }

    @Put('/update/a')
    @ResponseSchema(UserResponse)
    public async updateCurrent(@Body() body: BaseUser, @Req() req: any): Promise<Response> {
        return this.userService.updateCurrent(body, req.user).then((user) => success(user));
    }

    @Delete('/:id')
    public delete(@Param('id') id: number): Promise<void> {
        return this.userService.delete(id);
    }

    @Get('/roles/all')
    public getAllRoles(@Req() req: any): Promise<Role[]> {
        return this.userService.getAllRoles(req.user.role);
    }

    @Get('/users/all')
    public getListUser(@Req() req: any): Promise<Response> {
        return this.userService.getListUser(req.user).then(users => success(users));
    }

    @Get('/setting/get')
    public getSetting(@Req() req: any): Promise<Setting> {
        return this.userService.getSetting(req.user.id);
    }

    @Get('/parent/setting')
    public getParentSetting(@Req() req: any): Promise<Setting> {
        return this.userService.getSetting(req.user.parent.id);
    }

    @Put('/setting/localtion')
    public addSettingLocation(@Body() body: CheckArea[], @Req() req: any): Promise<any> {
        return this.userService.setLocation(req.user, body);
    }
}
