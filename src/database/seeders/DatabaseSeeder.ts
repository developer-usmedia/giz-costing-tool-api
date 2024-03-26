import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { BenchmarkFactory } from './factories/benchmark.factory';
import { SimulationFactory } from './factories/simulation.factory';
import { UserFactory } from './factories/user.factory';
import { WorkerFactory } from './factories/worker.factory';

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        await new BenchmarkFactory(em).create(10);

        const users = await new UserFactory(em).create(2);

        for (const user of users) {
            await new SimulationFactory(em)
                .each((simulation) => {
                    simulation.workers.add(new WorkerFactory(em).make(4, { simulation: simulation }));
                })
                .create(3, { user: user });
        }
    }
}
