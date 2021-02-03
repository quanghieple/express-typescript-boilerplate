import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDatabase1611894266885 implements MigrationInterface {
    public name = 'CreateDatabase1611894266885';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `shift` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `start` int NOT NULL, `end` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT, `role_name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `first_name` varchar(255) NOT NULL, `last_name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `phone` varchar(255) NOT NULL, `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `parentId` int NULL, INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), INDEX `IDX_8e1f623798118e629b46a9e629` (`phone`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `check_in` (`id` int NOT NULL AUTO_INCREMENT, `time` datetime NOT NULL, `week` varchar(255) NOT NULL, `userId` int NULL, `shiftId` int NULL, INDEX `IDX_98c73363ea30ce2a826ddd594e` (`time`), INDEX `IDX_c6f335b565e0604684e1f20821` (`week`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `setting` (`id` int NOT NULL AUTO_INCREMENT, `location` json NOT NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_roles_role` (`userId` int NOT NULL, `roleId` int NOT NULL, INDEX `IDX_5f9286e6c25594c6b88c108db7` (`userId`), INDEX `IDX_4be2f7adf862634f5f803d246b` (`roleId`), PRIMARY KEY (`userId`, `roleId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_c86f56da7bb30c073e3cbed4e50` FOREIGN KEY (`parentId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `check_in` ADD CONSTRAINT `FK_bf6f31f3f4c20b7cd20b6e674f6` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `check_in` ADD CONSTRAINT `FK_ecf3da92bae9bb3725128243fcc` FOREIGN KEY (`shiftId`) REFERENCES `shift`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `setting` ADD CONSTRAINT `FK_bbcafb8c4c78d890f75caa632d5` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_5f9286e6c25594c6b88c108db77` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_4be2f7adf862634f5f803d246b8` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_roles_role` DROP FOREIGN KEY `FK_4be2f7adf862634f5f803d246b8`");
        await queryRunner.query("ALTER TABLE `user_roles_role` DROP FOREIGN KEY `FK_5f9286e6c25594c6b88c108db77`");
        await queryRunner.query("ALTER TABLE `setting` DROP FOREIGN KEY `FK_bbcafb8c4c78d890f75caa632d5`");
        await queryRunner.query("ALTER TABLE `check_in` DROP FOREIGN KEY `FK_ecf3da92bae9bb3725128243fcc`");
        await queryRunner.query("ALTER TABLE `check_in` DROP FOREIGN KEY `FK_bf6f31f3f4c20b7cd20b6e674f6`");
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c86f56da7bb30c073e3cbed4e50`");
        await queryRunner.query("DROP INDEX `IDX_4be2f7adf862634f5f803d246b` ON `user_roles_role`");
        await queryRunner.query("DROP INDEX `IDX_5f9286e6c25594c6b88c108db7` ON `user_roles_role`");
        await queryRunner.query("DROP TABLE `user_roles_role`");
        await queryRunner.query("DROP TABLE `setting`");
        await queryRunner.query("DROP INDEX `IDX_c6f335b565e0604684e1f20821` ON `check_in`");
        await queryRunner.query("DROP INDEX `IDX_98c73363ea30ce2a826ddd594e` ON `check_in`");
        await queryRunner.query("DROP TABLE `check_in`");
        await queryRunner.query("DROP INDEX `IDX_8e1f623798118e629b46a9e629` ON `user`");
        await queryRunner.query("DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP TABLE `role`");
        await queryRunner.query("DROP TABLE `shift`");
    }

}
