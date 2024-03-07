import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { SimulationStatus } from '@common/enums/simulation-status.enum';
import { SimulationBenchmark, SimulationFacility } from '@database/embeddables';
import { Simulation } from '@database/entities/simulation.entity';

export class SimulationFactory extends Factory<Simulation> {
    model = Simulation;

    definition(): Simulation {
        const now = new Date();

        return new Simulation({
            // between now and 8 years ago
            year: faker.date.between({ from: new Date(now).setFullYear(now.getFullYear() - 8), to: now }).getFullYear(),
            user: null, // Needs to be set in the seeder itself
            status: SimulationStatus.OPEN,
            facility: new SimulationFacility({
                id: null, // SM facilityId
                name: faker.airline.airport().name,
                countryCode: faker.location.countryCode(),
                currencyCode: faker.finance.currencyCode(),
                product: faker.commerce.product(),
                unitOfProduction: faker.commerce.productMaterial(),
                annualProduction: faker.number.int({ min: 1000, max: 100000 }),
            }),
            benchmark: new SimulationBenchmark({
                source: faker.internet.displayName(),
                // between now and 8 years ago
                year: faker.date.between({ from: new Date(now).setFullYear(now.getFullYear() - 8), to: now }).getFullYear(),
                locality: faker.location.state(),
                region: faker.location.county(),
                localValue: Number(faker.commerce.price()),
                currencyName: faker.finance.currencyName(),
                currencyCode: faker.finance.currencyCode(),
            }),
        });
    }
}
