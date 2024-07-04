import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

import { Entry } from '@domain/entities';

// TODO: look at duplicate keys? (year, country...)

class EntryBenchmarkForm {
    @ApiProperty({ example: 2041, nullable: true })
    @IsNumber()
    @IsOptional()
    year?: number;

    @ApiProperty({ example: 'Nederland', minLength: 3, nullable: true })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiProperty({ example: 'São Paulo', maxLength: 50 })
    @IsString()
    region: string;

    @ApiProperty({ example: 465.0 })
    @IsNumber()
    @Min(0)
    value: number;

    @ApiProperty({ example: 'Rural', maxLength: 50, nullable: true })
    @IsString()
    @IsOptional()
    locality?: string;
}

class EntryBuyerForm {
    @ApiProperty({ example: 'Lidl', nullable: true })
    @IsString()
    @IsOptional()
    buyerName?: string;

    @ApiProperty({ example: 50, minimum: 0, maximum: 100, description: 'In percentage (%)', nullable: true })
    @IsNumber()
    @IsOptional()
    buyerProportion?: number;
}

class EntryFacilityForm {
    @ApiProperty({ example: 'OMN-23', required: false })
    @IsString()
    @IsOptional()
    facilityId: string;

    @ApiProperty({ example: 'My Banana Facility', nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'NLD', minLength: 2, maxLength: 3, nullable: true })
    @IsString()
    @IsOptional()
    countryCode?: string;

    @ApiProperty({ example: 'Nederland', minLength: 3, nullable: true })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiProperty({ example: 'Bananas', nullable: true })
    @IsString()
    @IsOptional()
    product?: string;

    @ApiProperty({ example: 'Box', nullable: true })
    @IsString()
    @IsOptional()
    productionUnit?: string;

    @ApiProperty({ example: 150000, minimum: 0, nullable: true })
    @IsNumber()
    @IsOptional()
    productionAmount?: number;
}

/**
 * API layer DTO used in the updating of a entry
 */
export class EntryUpdateForm {
    @ApiProperty({ example: 2041, nullable: true })
    @IsNumber()
    @IsOptional()
    year?: number;

    @ApiProperty({ example: '75', description: 'In LCU', nullable: true })
    @IsNumber()
    @IsOptional()
    overheadCosts?: number;

    @ApiProperty({ example: 2, minimum: 0, maximum: 100, description: 'In percentage (%)', nullable: true })
    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    taxEmployer?: number;

    @ApiProperty({ example: 1, minimum: 0, maximum: 100, description: 'In percentage (%)', nullable: true })
    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    taxEmployee?: number;

    @ApiProperty({ example: 'EUR', minLength: 3, maxLength: 3, nullable: true })
    @IsString()
    @IsOptional()
    currencyCode?: string;

    @ApiProperty({ nullable: true })
    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => EntryFacilityForm)
    buyer: EntryBuyerForm;

    @ApiProperty({ nullable: true })
    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => EntryFacilityForm)
    facility?: EntryFacilityForm;

    @ApiProperty({ nullable: true })
    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => EntryBenchmarkForm)
    benchmark?: EntryBenchmarkForm;

    // TODO: remunerationIncrease
    // Convert to database entity from DTO specified above
    public static toEntity(entry: Entry, form: EntryUpdateForm): Entry {
        if (form.year || form.currencyCode) {
            entry.updatePayrollInfo({
                year: form.year ?? entry.payroll.year,
                currencyCode: form.currencyCode ?? entry.payroll.currencyCode,
            });
        }

        if (form.overheadCosts || form.taxEmployer || form.taxEmployee) {
            entry.scenario?.updateSpecs({
                overheadCosts: form.overheadCosts ?? entry.scenario.specs.overheadCosts,
                taxEmployer: form.taxEmployer ?? entry.scenario.specs.taxEmployer,
                taxEmployee: form.taxEmployee ?? entry.scenario.specs.taxEmployer,
                remunerationIncrease: entry.scenario.specs.remunerationIncrease,
            });
        }

        if (form.facility) {
            entry.updateFacilityInfo({
                name: form.facility.name ?? entry.facility.name,
                country: form.facility.country ?? entry.facility.country,
                // countryCode: form.facility.countryCode ?? entry.facility.countryCode,
                facilityId: form.facility.facilityId ?? entry.facility.facilityId,
                products: form.facility.product ?? entry.facility.products,
                productionUnit: form.facility.productionUnit ?? entry.facility.productionUnit,
                productionAmount: form.facility.productionAmount ?? entry.facility.productionAmount,
            });
        }
        if (form.benchmark) {
            entry.selectBenchmark({
                country: form.benchmark.country ?? entry.benchmark.country,
                year: form.benchmark.year ?? entry.benchmark.year,
                region: form.benchmark.region ?? entry.benchmark.region,
                value: form.benchmark.value ?? entry.benchmark.value,
            });
        }

        return entry;
    }
}
