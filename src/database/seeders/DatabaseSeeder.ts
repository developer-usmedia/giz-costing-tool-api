import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { CreateUserDTO } from 'application/user/dto/create-user.dto';
import { User } from 'database/entities/user.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users: CreateUserDTO[] = [
      {
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
      },
    ];

    const john = CreateUserDTO.toEntity(new User(), users[0]);
    const jane = CreateUserDTO.toEntity(new User(), users[1]);

    await em.persistAndFlush(john);
    await em.persistAndFlush(jane);
  }
}
