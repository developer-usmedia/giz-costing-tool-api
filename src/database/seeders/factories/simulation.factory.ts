import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { SimulationStatus } from '@common/enums/simulation-status.enum';
import { CreateBenchmarkDTO } from '@database/embeddables/dto/create-benchmark.dto';
import { CreateFacilityDTO } from '@database/embeddables/dto/create-facility.dto';
import { Simulation } from '@database/entities/simulation.entity';
import { CreateSimulationDTO } from '../../entities/dto/create-simulation.dto';

export class SimulationFactory extends Factory<Simulation> {
    model = Simulation;

    definition(): Simulation {
        const now = new Date();

        return {
            ...CreateSimulationDTO.toEntity({
                name: faker.lorem.words(3),
                // between now and 8 years ago
                year: faker.date.between({ from: new Date(now).setFullYear(now.getFullYear() - 8), to: now }).getFullYear(),
                user: null, // Needs to be set in the seeder itself
            }),
            status: SimulationStatus.OPEN,
            facility: CreateFacilityDTO.toEntity({
                name: faker.airline.airport().name,
                countryCode: faker.location.countryCode(),
                currencyCode: faker.finance.currencyCode(),
                sector: faker.commerce.department(),
                product: faker.commerce.product(),
                unitOfProduction: faker.commerce.productMaterial(),
                annualProduction: faker.number.int({ min: 1000, max: 100000}),
            }),
            benchmark: {
                ...CreateBenchmarkDTO.toEntity({
                    name: faker.word.words(2),
                    source: faker.internet.displayName(),
                    // between now and 8 years ago
                    year: faker.date.between({ from: new Date(now).setFullYear(now.getFullYear() - 8), to: now }).getFullYear(),
                    locality: faker.location.state(),
                    lcuValue: Number(faker.commerce.price()),
                }),
                region: faker.location.county(),
            },
        };
    }
}
