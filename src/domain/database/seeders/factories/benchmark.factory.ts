import { Factory } from '@mikro-orm/seeder';

import { Benchmark } from '@domain/entities';

export class BenchmarkFactory extends Factory<Benchmark> {
    model = Benchmark;

    definition(): Partial<Benchmark> {
        return {
            source: 'Example',
            year: 2024,
            countryCode: 'NL',
            locality: null,
            region: 'Noord Holland',
            currencyCode: 'EUR',
            localValue: 2421.78,
            eurValue: 2421.78,
            usdValue: 2615.52,
        };
    }
}
