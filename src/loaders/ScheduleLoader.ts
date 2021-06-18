import { CheckIn, CheckinStatus } from '@/api/models/CheckIn';
import { Logger } from '@/lib/logger';
import { scheduleJob } from 'node-schedule';
import { getConnection } from 'typeorm';

const log = new Logger(__dirname);

const updateWorkShift = () => {
    scheduleJob("updateWorkShift", "00 01 00 ? * *", (date) => {
        log.info("Start update work shift");
        getConnection()
        .createQueryBuilder()
        .update(CheckIn)
        .set({ status: CheckinStatus.forgot })
        .where("status = :status", { status: CheckinStatus.Checkin })
        .execute();
    });
};

export const scheduleLoader = () => {
    updateWorkShift();
};
