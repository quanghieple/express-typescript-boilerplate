import { Service } from 'typedi';
import { getConnection, LessThanOrEqual, UpdateResult } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { CreateUserBody } from '../controllers/UserController';
import { Role } from '../models/Role';
import { Setting } from '../models/Setting';
import { User } from '../models/User';
import { RoleRepository } from '../repositories/RoleRepository';
import { UserRepository } from '../repositories/UserRepository';
import { SettingRepository } from '../repositories/SettingRepository';
import { events } from '../subscribers/events';
import { CheckArea } from '../object/CheckArea';

@Service()
export class UserService {

    constructor(
        @OrmRepository() private userRepository: UserRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private roleRepository: RoleRepository,
        @OrmRepository() private settingRepository: SettingRepository
    ) { }

    public findOne(id: number): Promise<User | undefined> {
        return this.userRepository.findOne({ id });
    }

    public countByEmail(email: string): Promise<number> {
        return this.userRepository.count({ email });
    }

    public getFullUser(id: string | number): Promise<User> {
        return this.userRepository.findOne({
            where: {
                id,
            },
            relations: ["role", "parent"],
        });
    }

    public async create(body: CreateUserBody, parent: any): Promise<User> {
        this.log.info("Creating user");
        const user = new User();
        user.email = body.email;
        user.name = body.name;
        user.birth = body.birth;
        user.password = body.password;
        user.username = body.email;
        user.phone = body.phone;

        user.parent = (new User()).withId(parent.id);
        user.setRole(await this.findRole(body.role), parent.role);
        const newUser = await this.userRepository.save(user);
        this.eventDispatcher.dispatch(events.user.created, newUser);
        return newUser;
    }

    public async update(user: User, body: any): Promise<User> {
        const update = this.assignUpdate(user, body, true);
        return this.userRepository.save(update);
    }

    public async updateCurrent(body: any, current: any): Promise<User> {
        const user = await this.findOne(current.id);
        const update = this.assignUpdate(user, body, current.role.name === "admin");
        return this.userRepository.save(update);
    }

    public async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
        return;
    }

    public findRole(id: number): Promise<Role> {
        return this.roleRepository.findOne({id});
    }

    public getAllRoles(role: any): Promise<Role[]> {
        this.log.info(JSON.stringify(role));
        return this.roleRepository.find({where: {priority: LessThanOrEqual(role.priority)}});
    }

    public getListUser(user: any): Promise<User[]> {
        return this.userRepository.find({where: {parent: {id: user.id}}});
    }

    public getSetting(user: any): Promise<Setting> {
        return this.settingRepository.findOne({user: {id: user.id}});
    }

    public setLocation(user: any, location: CheckArea[]): Promise<UpdateResult> {
        return getConnection()
        .createQueryBuilder()
        .innerJoin(User, "user")
        .update(Setting)
        .set({ location })
        .where("user.id = :id", { id: user.id })
        .execute();
    }

    private assignUpdate(user: User, body: any, full: boolean): User {
        user.name = body.name || user.name;
        user.birth = body.birth || user.birth;
        user.username = body.username || user.username;
        user.photoURL = body.photoURL || user.photoURL;
        user.address = body.address || user.address;
        user.profile = body.profile || user.profile;
        if (full) {
            user.email = body.email || user.email;
            user.phone = body.phone || user.phone;
        }

        return user;
    }
}
