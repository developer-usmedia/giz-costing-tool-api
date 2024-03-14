import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { SimulationBenchmark, SimulationFacility } from '@database/embeddables';

/**
 * API layer DTO used in the updating of a benchmark on a simulation
 */
export class SimulationBenchmarkForm {
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
    public static toEntity(benchmark: SimulationBenchmark, form: SimulationBenchmarkForm, facility: SimulationFacility): SimulationBenchmark {
        benchmark.region = form.region;
        benchmark.localValue = form.localValue;
        benchmark.currencyCode = facility.currencyCode; 

        if (form.locality) benchmark.locality = form.locality;

        return benchmark;
    }
}