import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../models/Role';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role>  {

}
