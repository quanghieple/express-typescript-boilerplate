import * as express from 'express';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { User } from '../api/models/User';
import { UserRepository } from '../api/repositories/UserRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { env } from '../env';

@Service()
export class AuthService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userRepository: UserRepository
    ) { }

    public parseBasicAuthFromRequest(req: express.Request): User | undefined {
        const authorization = req.header('authorization');

        if (authorization) {
            const decrypt = this.decryptJWT(authorization);
            return decrypt ? decrypt.user : undefined;
        }

        this.log.info('No credentials provided by the client');
        return undefined;
    }

    public async validateUser(username: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                username,
            },
            relations: ["roles"],
        });

        if (user && await User.comparePassword(user, password)) {
            return user;
        }

        return undefined;
    }

    public encryptJWT(user: User): string {
        const encryptUser = {id: user.id, roles: user.roles, parent: user.parent ? user.parent.id : undefined};
        return jwt.sign({ user: encryptUser }, env.jwt.secret, { expiresIn: env.jwt.expried });
    }

    public decryptJWT(token: string): any | undefined {
        try {
            return jwt.verify(token, env.jwt.secret);
        } catch (error) {
            return undefined;
        }
    }

}
