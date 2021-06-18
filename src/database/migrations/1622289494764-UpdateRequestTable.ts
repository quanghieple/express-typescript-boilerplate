import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateRequestTable1622289494764 implements MigrationInterface {
    public name = 'UpdateRequestTable1622289494764';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `notification` (`id` int NOT NULL AUTO_INCREMENT, `data` json NULL, `message` varchar(255) NOT NULL, `status` int NOT NULL, `from` int NULL, `to` int NULL, INDEX `IDX_aa6e6ec6142c586df7dd1cfcc7` (`to`, `status`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `request_update` (`id` int NOT NULL AUTO_INCREMENT, `note` varchar(255) NOT NULL, `status` int NOT NULL, `update_from` timestamp NOT NULL, `update_to` timestamp NOT NULL, `checkInId` int NULL, `from` int NULL, `to` int NULL, INDEX `IDX_4d5ee20a3a0ba4002e18c3235b` (`to`, `status`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `notification` ADD CONSTRAINT `FK_07bb2b9046ac67697db0c726bf3` FOREIGN KEY (`from`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `notification` ADD CONSTRAINT `FK_b333da72148e0c0e6cd2d8affc3` FOREIGN KEY (`to`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `request_update` ADD CONSTRAINT `FK_30eb0e793d5bc3df0c6ce0f9ac4` FOREIGN KEY (`checkInId`) REFERENCES `check_in`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `request_update` ADD CONSTRAINT `FK_4115f6807b5addbb33856b4ebce` FOREIGN KEY (`from`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `request_update` ADD CONSTRAINT `FK_50fb3819f468e6d364418426e0b` FOREIGN KEY (`to`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `request_update` DROP FOREIGN KEY `FK_50fb3819f468e6d364418426e0b`");
        await queryRunner.query("ALTER TABLE `request_update` DROP FOREIGN KEY `FK_4115f6807b5addbb33856b4ebce`");
        await queryRunner.query("ALTER TABLE `request_update` DROP FOREIGN KEY `FK_30eb0e793d5bc3df0c6ce0f9ac4`");
        await queryRunner.query("ALTER TABLE `notification` DROP FOREIGN KEY `FK_b333da72148e0c0e6cd2d8affc3`");
        await queryRunner.query("ALTER TABLE `notification` DROP FOREIGN KEY `FK_07bb2b9046ac67697db0c726bf3`");
        await queryRunner.query("DROP INDEX `IDX_4d5ee20a3a0ba4002e18c3235b` ON `request_update`");
        await queryRunner.query("DROP TABLE `request_update`");
        await queryRunner.query("DROP INDEX `IDX_aa6e6ec6142c586df7dd1cfcc7` ON `notification`");
        await queryRunner.query("DROP TABLE `notification`");
    }

}
