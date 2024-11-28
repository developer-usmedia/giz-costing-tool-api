import { Logger } from '@nestjs/common';
import Decimal from 'decimal.js';

import { Entry, EntryWorker } from '@domain/entities';
import { EntityValidationError } from '@import/errors/entity-validation.error';
import { ValidationResult } from '@import/errors/schema-validation.error';
import { EntryWorkerData, getEntryWorkerSchema } from '@import/schemas/entry-worker.schema';
import { validate } from '@import/utils/validate';

export class EntryWorkerFactory {
    private static readonly LOGGER = new Logger(EntryWorkerFactory.name);

    public static createEntity(data: Record<string, any>, entry: Entry): EntryWorker {
        const { value } = EntryWorkerFactory.validate(data);

        return new EntryWorker({
            entry: entry,
            name: value.name,
            gender: value.gender,
            nrOfWorkers: value.nrOfWorkers,
            percOfYearWorked: value.percOfYearWorked,
            remuneration: {
                baseWage: new Decimal(value.monthlyWage),
                bonuses: new Decimal(value.monthlyBonus),
                ikb: new Decimal(value.monthlyIkbCapped),
            },
        });
    }

    public static validate(data: Record<string, any>): ValidationResult<EntryWorkerData> {
        const schema = getEntryWorkerSchema();
        const result = validate<EntryWorkerData>(schema, data);

        if (!result.isValid && result.errors?.length) {
            EntryWorkerFactory.LOGGER.error('Validation failed ', data);
            EntryWorkerFactory.LOGGER.debug('Errors: ', result.errors);

            throw new EntityValidationError('Worker entity validation failed', result);
        }

        return result;
    }
}
