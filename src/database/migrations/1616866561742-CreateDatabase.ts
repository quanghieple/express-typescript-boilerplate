import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1616866561742 implements MigrationInterface {
    public name = 'CreateDatabase1616866561742';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `shift` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `start` int NOT NULL, `end` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT, `role_name` varchar(255) NOT NULL, `priority` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `birth` timestamp NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `phone` varchar(255) NOT NULL, `address` varchar(255) NOT NULL DEFAULT '', `profile` varchar(255) NOT NULL DEFAULT '', `disabled` tinyint NOT NULL DEFAULT 0, `photoURL` varchar(255) NOT NULL DEFAULT '', `created` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `roleId` int NULL, `parentId` int NULL, INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), INDEX `IDX_8e1f623798118e629b46a9e629` (`phone`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `check_in` (`id` int NOT NULL AUTO_INCREMENT, `inn` timestamp NOT NULL, `out` timestamp NOT NULL, `status` int NOT NULL, `month` varchar(255) NOT NULL, `date` int NOT NULL, `noteIn` varchar(255) NOT NULL DEFAULT '', `noteOut` varchar(255) NOT NULL DEFAULT '', `userId` int NULL, `shiftId` int NULL, INDEX `IDX_964ebc080c9734edb999c3d191` (`status`), INDEX `IDX_f8c446d318a7435cba56ee9399` (`month`), INDEX `IDX_286f836e73d03a0d5b4a905e6f` (`month`, `userId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `geo` (`id` int NOT NULL, `name` varchar(255) NOT NULL, `label` varchar(255) NOT NULL DEFAULT '', INDEX `IDX_7af1772da0d35642345f5986d0` (`name`), INDEX `IDX_b023ce9721530f8c734f320b39` (`label`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `setting` (`id` int NOT NULL AUTO_INCREMENT, `location` json NOT NULL, `shift` json NOT NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_c86f56da7bb30c073e3cbed4e50` FOREIGN KEY (`parentId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `check_in` ADD CONSTRAINT `FK_bf6f31f3f4c20b7cd20b6e674f6` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `check_in` ADD CONSTRAINT `FK_ecf3da92bae9bb3725128243fcc` FOREIGN KEY (`shiftId`) REFERENCES `shift`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `setting` ADD CONSTRAINT `FK_bbcafb8c4c78d890f75caa632d5` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `setting` DROP FOREIGN KEY `FK_bbcafb8c4c78d890f75caa632d5`");
        await queryRunner.query("ALTER TABLE `check_in` DROP FOREIGN KEY `FK_ecf3da92bae9bb3725128243fcc`");
        await queryRunner.query("ALTER TABLE `check_in` DROP FOREIGN KEY `FK_bf6f31f3f4c20b7cd20b6e674f6`");
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c86f56da7bb30c073e3cbed4e50`");
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c28e52f758e7bbc53828db92194`");
        await queryRunner.query("DROP TABLE `setting`");
        await queryRunner.query("DROP INDEX `IDX_b023ce9721530f8c734f320b39` ON `geo`");
        await queryRunner.query("DROP INDEX `IDX_7af1772da0d35642345f5986d0` ON `geo`");
        await queryRunner.query("DROP TABLE `geo`");
        await queryRunner.query("DROP INDEX `IDX_286f836e73d03a0d5b4a905e6f` ON `check_in`");
        await queryRunner.query("DROP INDEX `IDX_f8c446d318a7435cba56ee9399` ON `check_in`");
        await queryRunner.query("DROP INDEX `IDX_964ebc080c9734edb999c3d191` ON `check_in`");
        await queryRunner.query("DROP TABLE `check_in`");
        await queryRunner.query("DROP INDEX `IDX_8e1f623798118e629b46a9e629` ON `user`");
        await queryRunner.query("DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP TABLE `role`");
        await queryRunner.query("DROP TABLE `shift`");
    }

}
