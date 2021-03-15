import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { Role } from '../../api/models/Role';
import { Setting } from '../../api/models/Setting';
import { User } from '../../api/models/User';
import { CheckArea } from '../../api/object/CheckArea';
import { Coord } from '../../api/object/Coord';

export class CreateAdmin implements Seeder {

    public async run(factory: Factory, connection: Connection): Promise<void> {
        // const userFactory = factory<User, { role: string }>(User as any);
        // const adminUserFactory = userFactory({ role: 'admin' });

        // const bruce = await adminUserFactory.make();
        // console.log(bruce);

        // const bruce2 = await adminUserFactory.seed();
        // console.log(bruce2);

        // const bruce3 = await adminUserFactory
        //     .map(async (e: User) => {
        //         e.firstName = 'Bruce';
        //         return e;
        //     })
        //     .seed();
        // console.log(bruce3);

        // return bruce;

        // const connection = await factory.getConnection();
        const em = connection.createEntityManager();
        const adminRole = await em.save(new Role('Admin', 10));
        await em.save(new Role('Manager', 5));
        await em.save(new Role('User', 1));

        const user = new User();
        user.role = adminRole;
        user.name = 'Admin';
        user.email = 'admin@hrsol.com';
        user.birth = new Date();
        user.username = 'admin';
        user.password = 'admin@hr';
        user.phone = "0123456789";
        user.parent = (new User()).withId(1);
        // user.province = new Geo(79, "Thành phố Hồ Chí Minh", "Thành phố Trung ương", undefined);
        // user.city = new Geo(760, "Quận 1", "Quận", user.province);
        const savedUser = await em.save(user);

        const setting = new Setting();
        setting.location = new CheckArea(new Coord(10.7668435, 106.7078514), "default", 1000);
        setting.user = savedUser;
        await em.save(setting);
    }

}
