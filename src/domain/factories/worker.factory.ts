import { Logger } from '@nestjs/common';

import { WorkerIKB } from '@domain/embeddables/worker-ikb.embed';
import { Entry } from '@domain/entities/entry.entity';
import { Worker } from '@domain/entities/worker.entity';
import { EntityValidationError } from '@domain/errors/entity-validation.error';
import { ValidationResult } from '@domain/schemas/error/schema-validation.error';
import { WorkerData, getWorkerSchema } from '@domain/schemas/worker.schema';
import { validate } from '@domain/utils/validate';

export class WorkerFactory {
    private static readonly LOGGER = new Logger(WorkerFactory.name);

    public static createEntity(data: Record<string, any>, entry: Entry): Worker {
        const { value } = WorkerFactory.validate(data);

        return new Worker({
            entry: entry,
            name: value.name,
            gender: value.gender,
            numberOfWorkers: value.numberOfWorkers,
            monthlyWage: value.monthlyWage,
            monthlyBonus: value.monthlyWage,
            percentageOfYearWorked: value.percentageOfYearsWorked,
            employeeTax: value.employeeTax,
            employerTax: value.employeeTax,
            inKindBenefits: new WorkerIKB({
                ikbFood: value.ikbFood,
                ikbTransportation: value.ikbTransportation,
                ikbHousing: value.ikbHousing,
                ikbHealthcare: value.ikbHealthcare,
                ikbChildcare: value.ikbChildcare,
            }),
        });
    }

    public static validate(data: Record<string, any>): ValidationResult<WorkerData> {
        const schema = getWorkerSchema();
        const result = validate<WorkerData>(schema, data);

        if (!result.isValid && result.errors?.length) {

            WorkerFactory.LOGGER.error('Validation failed ', data);
            WorkerFactory.LOGGER.debug('Errors: ', result.errors);

            throw new EntityValidationError('Worker entity validation failed', result);
        }

        return result;
    }
}
