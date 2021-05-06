import { EntityRepository, Repository } from 'typeorm';
import { Shift } from '../models/Shift';

@EntityRepository(Shift)
export class ShiftRepository extends Repository<Shift> {

}
