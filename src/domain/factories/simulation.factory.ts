import { Logger } from '@nestjs/common';

import { SimulationFacility } from '@domain/embeddables/simulation-facility.embed';
import { Simulation } from '@domain/entities/simulation.entity';
import { User } from '@domain/entities/user.entity';
import { EntityValidationError } from '@domain/errors/entity-validation.error';
import { ValidationResult } from '@domain/schemas/error/schema-validation.error';
import { SimulationInfo, getSimulationInfoSchema } from '@domain/schemas/simulation-info.schema';
import { validate } from '@domain/utils/validate';

export class SimulationFactory {
    private static readonly LOGGER = new Logger(SimulationFactory.name);

    public static createEntity(data: Record<string, any>, user: User): Simulation {
        const { value } = SimulationFactory.validate(data);

        return new Simulation({
            matrixId: value.matrixId,
            year: value.year,
            user: user,
            facility: new SimulationFacility({
                name: value.facilityName,
                countryCode: value.countryCode,
                id: value.facilityId,
                currencyCode: value.currencyCode,
                product: value.productName,
                unitOfProduction: value.unitOfProduction,
                annualProduction: value.annualProduction,
            }),
        });
    }

    public static validate(data: Record<string, any>): ValidationResult<SimulationInfo> {
        const schema = getSimulationInfoSchema();
        const result = validate<SimulationInfo>(schema, data);

        if (!result.isValid && result.errors?.length) {
            SimulationFactory.LOGGER.error('Validation failed ', data);
            SimulationFactory.LOGGER.debug('Errors: ', result.errors);

            throw new EntityValidationError('Simulation entity validation failed', result);
        }

        return result;
    }
}
