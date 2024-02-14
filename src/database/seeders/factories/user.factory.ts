import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { CreateUserDTO } from '@api/auth/dto/create-user.dto';
import { User } from '@database/entities/user.entity';

export class UserFactory extends Factory<User> {
    model = User;

    definition(): Partial<User> {
        return {
            ...CreateUserDTO.toEntity({
                email: faker.internet.email(),
                password: faker.internet.password(),
            }),
            // Set additionl properties
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        };
    }
}
