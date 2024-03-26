import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { Benchmark } from '@domain/entities/benchmark.entity';

export class BenchmarkFactory extends Factory<Benchmark> {
    model = Benchmark;

    definition(): Partial<Benchmark> {
        const now = new Date();

        return {
            year: faker.date.between({ from: new Date(now).setFullYear(now.getFullYear() - 8), to: now }).getFullYear(),
            countryCode: faker.location.countryCode(),
            countryName: faker.location.country(),
            countryLocality: faker.location.state(),
            countryRegion: faker.location.county(),
            currencyCode: faker.finance.currencyCode(),
            currencyName: faker.finance.currencyName(),
            localValue: Number(faker.commerce.price()),
            eurValue: Number(faker.commerce.price()),
            usdValue: Number(faker.commerce.price()),
        };
    }
}
