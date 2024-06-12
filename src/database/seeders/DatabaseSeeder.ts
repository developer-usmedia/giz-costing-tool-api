import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { BenchmarkFactory } from '@database/seeders/factories/benchmark.factory';
import { EntryFactory } from '@database/seeders/factories/entry.factory';
import { UserFactory } from '@database/seeders/factories/user.factory';
import { WorkerFactory } from '@database/seeders/factories/worker.factory';

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        await new BenchmarkFactory(em).create(10);

        const users = await new UserFactory(em).create(2);

        for (const user of users) {
            await new EntryFactory(em)
                .each((entry) => {
                    entry.workers.add(new WorkerFactory(em).make(4, { entry: entry }));
                })
                .create(3, { user: user });
        }
    }
}
