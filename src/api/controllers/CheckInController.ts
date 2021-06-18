import CryptoJS from 'crypto-js';
import {
    Authorized, Body, Get, JsonController, OnUndefined, Param, Post, QueryParam, Req
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { CheckIn } from '../models/CheckIn';
import { RequestUpdate } from '../models/RequestUpdate';

import { Shift } from '../models/Shift';
import { CheckInRepository } from '../repositories/CheckInRepository';
import { SettingRepository } from '../repositories/SettingRepository';
import { CheckInService } from '../services/CheckInService';
import { CheckTimeLimit } from '../utils/DateUtil';
import { getDistance } from '../utils/MapUtil';
import { BaseCheckin, WorkShiftUpdate } from './requests/Checkin';
import { CheckInError, CommonError } from './responses/ErrorCode';
import { fail, get, Response, success } from './responses/Response';

const secretQR = 'secret key 123';
@Authorized()
@JsonController("/check")
@OpenAPI({ security: [{ basicAuth: [] }] })
export class CheckInController {
    constructor(
        private checkinService: CheckInService,
        @OrmRepository() private settingRepository: SettingRepository,
        @OrmRepository() private checkinRepository: CheckInRepository) {}

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

    @Get('/history')
    public getHistory(@Req() req: any, @QueryParam('month') month: string): Promise<CheckIn[]> {
        return this.checkinService.getHistory(req.user, month);
    }

    @Post('/shift/update')
    public newShift(@Body() body: Shift, @Req() req: any): Promise<Response> {
        return this.checkinService.saveShift(body).then(shift => success(shift)).catch(err => fail(CommonError.UPDATE_FAILED, err));
    }

    @Get('/shift/list')
    public getAllShift(): Promise<Shift[]> {
        return this.checkinService.getAllShift();
    }

    @Post('/work-shift/update')
    public async updateWorkShift(@Body() data: WorkShiftUpdate, @Req() req: any): Promise<Response> {
        const checkin = await this.checkinRepository.findOne({ where: { id: data.checkId, user: { id: req.user.id }} });
        if (checkin) {
            return success(this.checkinService.updateWorkShift(req.user, data, checkin));
        } else {
            return fail(CommonError.NOT_FOUND, "Checkin not found");
        }
    }

    @Get('/work-shift/update/:id')
    public getWorkShiftUpdate(@Param('id') id: number): Promise<Response> {
        return this.checkinService.getRequestWorkShift(id).then(res => get(res));
    }

    @Get('/work-shift/requeted')
    public getWorkShiftRequeted(@Req() req: any, @QueryParam('month') month: string): Promise<RequestUpdate[]> {
        return this.checkinService.getRequestedWorkShift(req.user, month);
    }

    @Get('/checkin/:id')
    @OnUndefined(200)
    public getCheckin(@Param('id') id: number): Promise<CheckIn> {
        return this.checkinRepository.findOne({where: { id }, relations: ["shift"]});
    }
}
