import { Authorized, JsonController } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Authorized()
@JsonController("/check")
@OpenAPI({ security: [{ basicAuth: [] }] })
export class CheckInController {

}
