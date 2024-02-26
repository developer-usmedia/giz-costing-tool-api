import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { Gender } from '@common/enums/gender.enum';
import { Worker } from '@database/entities';

export class WorkerFactory extends Factory<Worker> {
    model = Worker;

    definition(): Worker {
        return new Worker({
            simulation: null,
            name: faker.person.jobTitle(),
            gender: Math.random() < 0.5 ? Gender.Men : Gender.Women,
            numberOfWorkers: faker.number.int({ min: 2, max: 26 }),
            monthlyWage: faker.number.int({ min: 200, max: 1000 }),
            monthlyBonus: faker.number.int({ min: 10, max: 50 }),
            percentageOfYearWorked: faker.number.int({ min: 80, max: 100 }),
            employeeTax: faker.number.int({ min: 0, max: 3 }),
            employerTax: faker.number.int({ min: 0, max: 3 }),
            inKindBenefits: null, // Constructor will set all values on 0
        });
    }
}
