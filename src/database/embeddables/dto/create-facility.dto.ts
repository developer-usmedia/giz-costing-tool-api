import { IsNumber, IsOptional, IsString } from 'class-validator';

import { Facility } from '@database/embeddables/facility.embeddable';

/**
 * Database layer DTO used in the creation of a benchmark embeddable for simulation
 */
export class CreateFacilityDTO {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    countryCode!: string;

    @IsString()
    currencyCode!: string;

    @IsString()
    @IsOptional()
    sector?: string;

    @IsString()
    product!: string;

    @IsString()
    unitOfProduction!: string;

    @IsNumber()
    annualProduction!: number;

    public static toEntity(form: CreateFacilityDTO): Facility {
        return new Facility({
            name: form.name,
            id: form.id,
            countryCode: form.countryCode,
            currencyCode: form.currencyCode,
            sector: form.sector,
            product: form.product,
            unitOfProduction: form.unitOfProduction,
            annualProduction: form.annualProduction,
        });
    }
}
