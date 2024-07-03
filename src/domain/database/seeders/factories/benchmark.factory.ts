import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { Benchmark } from '@domain/entities';

export class BenchmarkFactory extends Factory<Benchmark> {
    model = Benchmark;

    definition(): Partial<Benchmark> {
        const now = new Date();

        return {
            source: 'examples',
            year: faker.date.between({ from: new Date(now).setFullYear(now.getFullYear() - 8), to: now }).getFullYear(),
            countryCode: faker.location.countryCode(),
            locality: faker.location.state(),
            region: faker.location.county(),
            currencyCode: faker.finance.currencyCode(),
            localValue: Number(faker.commerce.price()),
            eurValue: Number(faker.commerce.price()),
            usdValue: Number(faker.commerce.price()),
        };
    }
}
