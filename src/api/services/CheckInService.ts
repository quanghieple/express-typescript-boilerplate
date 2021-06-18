import { Builder } from 'builder-pattern';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { WorkShiftUpdate } from '../controllers/requests/Checkin';
import { CheckIn, CheckinStatus } from '../models/CheckIn';
import { Notification, NotiStatus } from '../models/Notification';
import { RequestStatus, RequestUpdate } from '../models/RequestUpdate';
import { Shift } from '../models/Shift';
import { User } from '../models/User';
import { CheckInRepository } from '../repositories/CheckInRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { RequestUpdateRepository } from '../repositories/RequestUpdateRepository';
import { ShiftRepository } from '../repositories/ShiftRepository';
import { RoleValue } from '../models/Role';
import { getConnection } from 'typeorm';

@Service()
export class CheckInService {
    constructor(
        @OrmRepository() private checkinRepository: CheckInRepository,
        @OrmRepository() private shiftRepository: ShiftRepository,
        @OrmRepository() private notificationRepository: NotificationRepository,
        @OrmRepository() private requestUpdateRepository: RequestUpdateRepository
    ) { }

    public checkIn(user: any, time: number, shift: number, note: string): Promise<CheckIn> {
        const checkin = new CheckIn(time, new User().withId(user.id), Builder<Shift>().id(shift).build(), note);
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

    public async updateWorkShift(user: any, data: WorkShiftUpdate, checkin: CheckIn): Promise<any> {
        let code = RequestStatus.Approve;
        let update = undefined;
        if (data.checkout) {
            if (user.role.name === RoleValue.Admin) {
                checkin.out = data.checkout;
                checkin.status = CheckinStatus.Checkout;
            } else {
                const from = new User().withId(user.id);
                const to = new User().withId(user.parent.id);
                let request = await this.getRequestWorkShift(data.checkId);
                if (!request) {
                    request = new RequestUpdate();
                }
                request.updateFrom = checkin.out;
                request.updateTo = data.checkout;
                request.from = from;
                request.to = to;
                request.checkIn = checkin;
                request.note = data.requestNote;
                request.status = RequestStatus.Wating;
                update = await this.requestUpdateRepository.save(request);

                const notification = new Notification();
                notification.from = from;
                notification.to = to;
                notification.status = NotiStatus.Unread;
                notification.msg = "m co request update work shift";
                notification.data = "";
                this.notificationRepository.save(notification);
                code = RequestStatus.Wating;
            }
        }
        checkin.noteIn = data.noteIn;
        checkin.noteOut = data.noteOut;
        this.checkinRepository.save(checkin);
        return { code, update };
    }

    public getRequestWorkShift(checkId: number): Promise<RequestUpdate> {
        return this.requestUpdateRepository.findOne({ where: { checkIn: { id: checkId} } });
    }

    public getRequestedWorkShift(user: any, month: string): Promise<RequestUpdate[]> {
        return getConnection().getRepository(RequestUpdate)
            .createQueryBuilder("requestUpdate")
            .innerJoin("requestUpdate.checkIn", "checkIn")
            .where("checkIn.month = :month", { month })
            .andWhere("checkIn.userId = :user_id", { user_id: user.id })
            .getMany();
    }
}
