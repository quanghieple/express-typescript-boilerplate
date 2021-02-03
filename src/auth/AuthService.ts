import * as express from 'express';
import { env } from '../env';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { User } from '../api/models/User';
import { UserRepository } from '../api/repositories/UserRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';

import jwt from 'jsonwebtoken';
@Service()
export class AuthService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userRepository: UserRepository
    ) { }

    public parseBasicAuthFromRequest(req: express.Request): User | undefined {
        const authorization = req.header('authorization');

        if (authorization) {
            return this.decodeJWT(authorization);
        }

        this.log.info('No credentials provided by the client');
        return undefined;
    }

    public async validateUser(username: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                username,
            },
        });

        if (await User.comparePassword(user, password)) {
            return user;
        }

        return undefined;
    }

    public encodeJWT(user: User): string {
        return jwt.sign({ id: user.id }, env.jwt.secret, { expiresIn: env.jwt.expried });
    }

    public decodeJWT(token: string): User | undefined {
        try {
            return jwt.verify(token, env.jwt.secret);
        } catch (error) {
            return undefined;
        }
    }

}
