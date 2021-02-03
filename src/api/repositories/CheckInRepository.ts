import { EntityRepository, Repository } from 'typeorm';
import { CheckIn } from '../models/CheckIn';

@EntityRepository(CheckIn)
export class CheckInRepository extends Repository<CheckIn>  {

}
