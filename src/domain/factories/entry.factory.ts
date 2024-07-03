import { Logger } from '@nestjs/common';

import { Entry, EntryBenchmark, EntryFacility, EntryPayroll, User } from '@domain/entities';
import { EntityValidationError } from '@domain/errors/entity-validation.error';
import { EntryInfo, getEntryInfoSchema } from '@domain/schemas/entry-info.schema';
import { ValidationResult } from '@domain/schemas/error/schema-validation.error';
import { validate } from '@domain/utils/validate';

export class EntryFactory {
    private static readonly LOGGER = new Logger(EntryFactory.name);

    public static createEntity(data: Record<string, any>, user: User): Entry {
        const { value } = EntryFactory.validate(data);

        return new Entry({
            userId: user.id,
            matrixId: value.matrixId,
            payroll: new EntryPayroll({
                year: value.year,
                currencyCode: value.currencyCode,
            }),
            facility: new EntryFacility({
                name: value.facilityName,
                country: value.country,
                facilityId: value.facilityId,
                products: value.productName,
                productionUnit: value.productionUnit,
                productionAmount: value.productionAmount,
            }),
            benchmark: new EntryBenchmark({
                value: value.benchmarkValue,
                region: value.region,
                country: value.country,
                year: value.year,
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
