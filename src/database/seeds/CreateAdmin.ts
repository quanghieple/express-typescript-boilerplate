import { Role } from '../../api/models/Role';
import { Setting } from '../../api/models/Setting';
import { CheckArea } from '../../api/object/CheckArea';
import { Coord } from '../../api/object/Coord';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { User } from '../../api/models/User';

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
        const adminRole = await em.save(new Role('admin'));
        await em.save(new Role('manager'));
        await em.save(new Role('user'));

        const user = new User();
        user.roles = [adminRole];
        user.firstName = 'Admin';
        user.lastName = 'Admin';
        user.email = 'admin@hrsol.com';
        user.username = 'admin';
        user.password = 'admin@hr';
        user.phone = "0123456789";
        const savedUser = await em.save(user);

        const setting = new Setting();
        setting.location = new CheckArea(new Coord(10.7668435, 106.7078514), "default", 1000);
        setting.user = savedUser;
        await em.save(setting);
    }

}
