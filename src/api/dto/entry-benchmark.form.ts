import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { EntryBenchmark } from '@domain/embeddables/entry-benchmark.embed';
import { EntryFacility } from '@domain/embeddables/entry-facility.embed';

/**
 * API layer DTO used in the updating of a benchmark on a entry
 */
export class EntryBenchmarkForm {
    @ApiProperty({ example: 'São Paulo', maxLength: 50 })
    @IsString()
    region: string;

    @ApiProperty({ example: 465.0 })
    @IsNumber()
    localValue: number;

    @ApiProperty({ example: 'Rural', maxLength: 50, nullable: true })
    @IsString()
    @IsOptional()
    locality?: string;

    // Convert to database entity from DTO specified above
    public static toEntity(
        benchmark: EntryBenchmark,
        form: EntryBenchmarkForm,
        facility: EntryFacility,
    ): EntryBenchmark {
        benchmark.region = form.region;
        benchmark.localValue = form.localValue;
        benchmark.currencyCode = facility.currencyCode;

        return benchmark;
    }
}
