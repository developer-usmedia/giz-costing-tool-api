import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { User } from '@domain/entities/user.entity';

export class UserFactory extends Factory<User> {
    model = User;

    definition(): Partial<User> {
        return {
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
    }
}
