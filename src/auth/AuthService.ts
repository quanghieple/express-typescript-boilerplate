import * as express from 'express';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import { User } from '../api/models/User';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { env } from '../env';

@Service()
export class AuthService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
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

    public encryptJWT(user: User): string {
        const encryptUser = {id: user.id, role: user.role, parent: {id: user.parent.id, role: user.parent.role}};
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
