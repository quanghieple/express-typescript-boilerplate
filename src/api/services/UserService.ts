import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { events } from '../subscribers/events';

@Service()
export class UserService {

    constructor(
        @OrmRepository() private userRepository: UserRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public findOne(id: number): Promise<User | undefined> {
        this.log.info('Find one user');
        return this.userRepository.findOne({ id });
    }

    public async create(user: User): Promise<User> {
        const newUser = await this.userRepository.save(user);
        this.eventDispatcher.dispatch(events.user.created, newUser);
        return newUser;
    }

    public update(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    public async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
        return;
    }

}
