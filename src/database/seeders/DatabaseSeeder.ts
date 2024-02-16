import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { SimulationFactory } from './factories/simulation.factory';
import { UserFactory } from './factories/user.factory';

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        await new UserFactory(em)
            .each((user) => {
                user.simulations.add(new SimulationFactory(em).make(4));
            })
            .create(2);
    }
}
