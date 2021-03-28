import CryptoJS from 'crypto-js';
import {
    Authorized, Body, Get, JsonController, OnUndefined, Post, QueryParam, Req
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { CheckIn } from '../models/CheckIn';
import { Shift } from '../models/Shift';
import { SettingRepository } from '../repositories/SettingRepository';
import { CheckInService } from '../services/CheckInService';
import { CheckTimeLimit } from '../utils/DateUtil';
import { getDistance } from '../utils/MapUtil';
import { CheckInError } from './responses/ErrorCode';
import { fail, Response, success } from './responses/Response';

const secretQR = 'secret key 123';
export class BaseCheckin {
    public id: number;
    public time: number;
    public shift: number;
    public data: any;
    public note: string;
}
@Authorized()
@JsonController("/check")
@OpenAPI({ security: [{ basicAuth: [] }] })
export class CheckInController {
    constructor(
        private checkinService: CheckInService,
        @OrmRepository() private settingRepository: SettingRepository) {}

    public validateCheckIn(time: number, timeoutCode: number = CheckInError.TIME_TIMEOUT): number {
        const date = new Date(time);
        if (!date) {return CheckInError.INVALID_TIME; } else if (!CheckTimeLimit(date)) {return timeoutCode; } else {return 0; }
    }

    @Post('/location')
    public async localtionCheck(@Req() req: any, @Body() checkin: BaseCheckin): Promise<Response> {
        const setting = await this.settingRepository.findOne({user: {id: req.user.parent.id}});
        const locations = setting.location;
        const validate = this.validateCheckIn(checkin.time);
        const isOk = locations.some((loc: any) => getDistance(loc.coord, {lat: checkin.data.lat, lng: checkin.data.lng}) <= loc.radius);
        if (validate !== 0) {
            return fail(validate);
        } else if (isOk) {
            if (checkin.id) {
                return this.checkinService.checkout(req.user, checkin.time, checkin.id, checkin.note)
                    .then(c => c ? success(c) : fail(CheckInError.ID_NOT_FOUND));
            } else {
                return this.checkinService.checkIn(req.user, checkin.time, checkin.shift, checkin.note).then(c => success(c));
            }
        } else {
            return fail(CheckInError.OUT_LOCATION);
        }
    }

    @Post('/qr')
    public async QRCheck(@Req() req: any, @Body() checkin: BaseCheckin): Promise<Response> {
        const bytes  = CryptoJS.AES.decrypt(checkin.data.ciphertext, secretQR);
        const time = bytes.toString(CryptoJS.enc.Utf8);
        console.log(time);
        const validate = this.validateCheckIn(time, CheckInError.QR_TIMEOUT);
        if (validate === 0) {
            if (this.validateCheckIn(checkin.time) === 0) {
                if (checkin.id) {
                    return this.checkinService.checkout(req.user, checkin.time, checkin.id, checkin.note)
                        .then(c => c ? success(c) : fail(CheckInError.ID_NOT_FOUND));
                } else {
                    return this.checkinService.checkIn(req.user, checkin.time, checkin.shift, checkin.note).then(c => success(c));
                }
            } else {
                return fail(CheckInError.TIME_TIMEOUT);
            }
        } else {
            return fail(validate);
        }
    }

    @Get('/qr-code')
    public GetQRCode(): string {
        return CryptoJS.AES.encrypt(new Date().getTime() + "", secretQR).toString();
    }

    @Get('/shift/current')
    @OnUndefined(200)
    public currentShift(@Req() req: any): Promise<CheckIn> {
        return this.checkinService.getCurrentShift(req.user);
    }

    @Get('/shift/list')
    public shiftList(@Req() req: any): Promise<Shift[]> {
        return this.settingRepository.findOne({user: {id: req.user.parent.id}}).then(s => s.shift);
    }

    @Get('/history')
    public getHistory(@Req() req: any, @QueryParam('month') month: string): Promise<CheckIn[]> {
        return this.checkinService.getHistory(req.user, month);
    }
}
