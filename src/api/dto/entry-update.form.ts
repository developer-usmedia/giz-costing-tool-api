import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, Max, Min, ValidateNested } from 'class-validator';

import { Entry } from '@domain/entities/entry.entity';
import { EntryBenchmarkForm } from './entry-benchmark.form';
import { EntryFacilityForm } from './entry-facility.form';

/**
 * API layer DTO used in the updating of a user
 */
export class EntryUpdateForm {
    @ApiProperty({ example: 2041, nullable: true })
    @IsNumber()
    @IsOptional()
    year?: number;

    @ApiProperty({ example: '75', description: 'In LCU', nullable: true })
    @IsNumber()
    @IsOptional()
    administrativeCosts?: number;

    @ApiProperty({ example: 2, minimum: 0, maximum: 100, description: 'In percentage (%)', nullable: true })
    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    defaultEmployerTax?: number;

    @ApiProperty({ example: 1, minimum: 0, maximum: 100, description: 'In percentage (%)', nullable: true })
    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    defaultEmployeeTax?: number;

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

    // Convert to database entity from DTO specified above
    public static toEntity(entry: Entry, form: EntryUpdateForm): Entry {
        if (form.year) entry.year = form.year;
        if (form.administrativeCosts) entry.administrativeCosts = form.administrativeCosts;
        if (form.defaultEmployerTax) entry.defaultEmployerTax = form.defaultEmployerTax;
        if (form.defaultEmployeeTax) entry.defaultEmployeeTax = form.defaultEmployeeTax;

        if (form.facility) entry.facility = EntryFacilityForm.toEntity(entry.facility, form.facility);
        if (form.benchmark)
            entry.benchmark = EntryBenchmarkForm.toEntity(
                entry.benchmark,
                form.benchmark,
                entry.facility,
            );

        return entry;
    }
}
