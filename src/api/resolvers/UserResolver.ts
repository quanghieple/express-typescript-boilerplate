import { Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { User } from '../types/User';

@Service()
@Resolver(of => User)
export class UserResolver {

}
