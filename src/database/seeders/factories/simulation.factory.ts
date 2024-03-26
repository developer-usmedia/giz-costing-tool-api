import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { Simulation } from '@domain/entities/simulation.entity';
import { SimulationStatus } from '@domain/enums/simulation-status.enum';

export class SimulationFactory extends Factory<Simulation> {
    model = Simulation;

    definition(): Partial<Simulation> {
        const now = new Date();

        return {
            year: faker.date.between({ from: new Date(now).setFullYear(now.getFullYear() - 8), to: now }).getFullYear(),
            status: SimulationStatus.OPEN,
            facility: {
                name: faker.airline.airport().name,
                countryCode: faker.location.countryCode(),
                currencyCode: faker.finance.currencyCode(),
                product: faker.commerce.product(),
                unitOfProduction: faker.commerce.productMaterial(),
                annualProduction: faker.number.int({ min: 1000, max: 100000 }),
            },
            benchmark: {
                source: faker.internet.displayName(),
                // between now and 8 years ago
                year: faker.date.between({ from: new Date(now).setFullYear(now.getFullYear() - 8), to: now }).getFullYear(),
                locality: faker.location.state(),
                region: faker.location.county(),
                localValue: Number(faker.commerce.price()),
                currencyName: faker.finance.currencyName(),
                currencyCode: faker.finance.currencyCode(),
            },
        };
    }
}
