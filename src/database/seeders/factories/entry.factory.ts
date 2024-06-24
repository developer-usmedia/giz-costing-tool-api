import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { Entry } from '@domain/entities/entry.entity';
import { EntryStatus } from '@domain/enums/entry-status.enum';

export class EntryFactory extends Factory<Entry> {
    model = Entry;

    definition(): Partial<Entry> {
        const now = new Date();

        return {
            year: faker.date.between({ from: new Date(now).setFullYear(now.getFullYear() - 8), to: now }).getFullYear(),
            status: EntryStatus.OPEN,
            facility: {
                name: faker.airline.airport().name,
                country: faker.location.country(),
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
                region: faker.location.county(),
                localValue: Number(faker.commerce.price()),
                currencyName: faker.finance.currencyName(),
                currencyCode: faker.finance.currencyCode(),
            },
        };
    }
}
