import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { Worker } from '@domain/entities/worker.entity';
import { Gender } from '@domain/enums/gender.enum';

export class WorkerFactory extends Factory<Worker> {
    model = Worker;

    definition(): Partial<Worker> {
        return {
            name: faker.person.jobTitle(),
            gender: Math.random() < 0.5 ? Gender.Men : Gender.Women,
            numberOfWorkers: faker.number.int({ min: 2, max: 26 }),
            monthlyWage: faker.number.int({ min: 200, max: 1000 }),
            monthlyBonus: faker.number.int({ min: 10, max: 50 }),
            percentageOfYearWorked: faker.number.int({ min: 80, max: 100 }),
            employeeTax: faker.number.int({ min: 0, max: 3 }),
            employerTax: faker.number.int({ min: 0, max: 3 }),
        };
    }
}
