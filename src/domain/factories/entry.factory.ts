import { Logger } from '@nestjs/common';

import { EntryBenchmark } from '@domain/embeddables/entry-benchmark.embed';
import { EntryFacility } from '@domain/embeddables/entry-facility.embed';
import { Entry } from '@domain/entities/entry.entity';
import { User } from '@domain/entities/user.entity';
import { EntityValidationError } from '@domain/errors/entity-validation.error';
import { EntryInfo, getEntryInfoSchema } from '@domain/schemas/entry-info.schema';
import { ValidationResult } from '@domain/schemas/error/schema-validation.error';
import { validate } from '@domain/utils/validate';

export class EntryFactory {
    private static readonly LOGGER = new Logger(EntryFactory.name);

    public static createEntity(data: Record<string, any>, user: User): Entry {
        const { value } = EntryFactory.validate(data);

        return new Entry({
            matrixId: value.matrixId,
            year: value.year,
            user: user,
            facility: new EntryFacility({
                name: value.facilityName,
                countryCode: value.countryCode,
                id: value.facilityId,
                currencyCode: value.currencyCode,
                product: value.productName,
                unitOfProduction: value.unitOfProduction,
                annualProduction: value.annualProduction,
            }),
            benchmark: new EntryBenchmark({
                name: value.benchmarkName,
                currencyCode: value.currencyCode,
                localValue: value.benchmarkValue,
            }),
        });
    }

    public static validate(data: Record<string, any>): ValidationResult<EntryInfo> {
        const schema = getEntryInfoSchema();
        const result = validate<EntryInfo>(schema, data);

        if (!result.isValid && result.errors?.length) {
            EntryFactory.LOGGER.error('Validation failed ', data);
            EntryFactory.LOGGER.debug('Errors: ', result.errors);

            throw new EntityValidationError('Entry entity validation failed', result);
        }

        return result;
    }
}
