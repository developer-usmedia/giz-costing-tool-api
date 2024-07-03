import { Logger } from '@nestjs/common';

import { Entry, EntryWorker } from '@domain/entities';
import { EntityValidationError } from '@domain/errors/entity-validation.error';
import { EntryWorkerData, getEntryWorkerSchema } from '@domain/schemas/entry-worker.schema';
import { ValidationResult } from '@domain/schemas/error/schema-validation.error';
import { validate } from '@domain/utils/validate';

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
                baseWage: value.monthlyWage,
                bonuses: value.monthlyBonus,
                ikbHousing: value.ikbHousing,
                ikbFood: value.ikbFood,
                ikbTransport: value.ikbTransport,
                ikbHealthcare: value.ikbHealthcare,
                ikbChildcare: value.ikbChildcare,
                ikbChildEducation: value.ikbChildEducation,
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
