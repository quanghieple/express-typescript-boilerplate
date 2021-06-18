import { EntityRepository, Repository } from "typeorm";
import { RequestUpdate } from "../models/RequestUpdate";

@EntityRepository(RequestUpdate)
export class RequestUpdateRepository extends Repository<RequestUpdate>  {

}
