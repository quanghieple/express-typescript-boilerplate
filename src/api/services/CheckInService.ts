import { Builder } from 'builder-pattern';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { CheckIn, CheckinStatus } from '../models/CheckIn';
import { Shift } from '../models/Shift';
import { User } from '../models/User';
import { CheckInRepository } from '../repositories/CheckInRepository';
import { ShiftRepository } from '../repositories/ShiftRepository';

@Service()
export class CheckInService {
    constructor(
        @OrmRepository() private checkinRepository: CheckInRepository,
        @OrmRepository() private shiftRepository: ShiftRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public checkIn(user: any, time: number, shift: number, note: string): Promise<CheckIn> {
        const checkin = new CheckIn(time, new User().withId(user.id), Builder<Shift>().id(shift).build(), note);
        this.log.info(JSON.stringify(checkin));
        return this.checkinRepository.save(checkin);
    }

    public async checkout(user: any, time: number, id: number, note: string): Promise<CheckIn> {
        const checkin = await this.checkinRepository.findOne({ id });
        if (checkin) {
            checkin.out = new Date(time);
            checkin.status = CheckinStatus.Checkout;
            checkin.noteOut = note;
            return this.checkinRepository.save(checkin);
        }
        return checkin;
    }

    public getCurrentShift(user: any): Promise<CheckIn> {
        return this.checkinRepository.findOne({
            where: {user: { id : user.id}, status: CheckinStatus.Checkin},
            relations: ["shift"],
        });
    }

    public getHistory(user: any, month: string): Promise<CheckIn[]> {
        return this.checkinRepository.find({
            where: {user: { id : user.id}, month},
            relations: ["shift"],
        });
    }

    public saveShift(shift: Shift): Promise<Shift> {
        return this.shiftRepository.save(shift);
    }

    public getAllShift(): Promise<Shift[]> {
        return this.shiftRepository.find();
    }
}
