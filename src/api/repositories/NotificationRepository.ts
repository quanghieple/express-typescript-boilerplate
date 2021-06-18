import { EntityRepository, Repository } from "typeorm";
import { Notification } from "../models/Notification";

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification>  {

}
