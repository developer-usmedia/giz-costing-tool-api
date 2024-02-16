import { IsNumber, IsString } from 'class-validator';

import { Benchmark } from '@database/embeddables/benchmark.embeddable';

/**
 * Database layer DTO used in the creation of a benchmark embeddable for simulation
 */
export class CreateBenchmarkDTO {
    @IsString()
    name!: string;

    @IsNumber()
    year!: number;

    @IsString()
    source!: string;

    @IsString()
    locality!: string;

    @IsNumber()
    lcuValue!: number;

    public static toEntity(form: CreateBenchmarkDTO): Benchmark {
        return new Benchmark({
            name: form.name,
            year: form.year,
            source: form.source,
            locality: form.locality,
            lcuValue: form.lcuValue,
        });
    }
}
