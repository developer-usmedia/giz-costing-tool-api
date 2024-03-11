import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator';

import { Simulation } from '@database/entities';
import { SimulationBenchmarkForm } from './simulation-benchmark.form';
import { SimulationFacilityForm } from './simulation-facility.form';

/**
 * API layer DTO used in the updating of a user
 */
export class UpdateSimulationForm {
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
    @IsOptional()
    defaultEmployerTax?: number;

    @ApiProperty({ example: 1, minimum: 0, maximum: 100, description: 'In percentage (%)', nullable: true })
    @IsNumber()
    @IsOptional()
    defaultEmployeeTax?: number;

    @ApiProperty({ nullable: true })
    @IsObject()
    @IsOptional()
    @ValidateNested({ each: true })
    facility?: SimulationFacilityForm;

    @ApiProperty({ nullable: true })
    @IsObject()
    @IsOptional()
    @ValidateNested({ each: true })
    benchmark?: SimulationBenchmarkForm;

    // Convert to database entity from DTO specified above
    public static toEntity(simulation: Simulation, form: UpdateSimulationForm): Simulation {
        if (form.year) simulation.year = form.year;
        if (form.administrativeCosts) simulation.administrativeCosts = form.administrativeCosts;
        if (form.defaultEmployerTax) simulation.defaultEmployerTax = form.defaultEmployerTax;
        if (form.defaultEmployeeTax) simulation.defaultEmployeeTax = form.defaultEmployeeTax;

        if (form.facility) simulation.facility = SimulationFacilityForm.toEntity(simulation.facility, form.facility);
        if (form.benchmark) simulation.benchmark = SimulationBenchmarkForm.toEntity(simulation.benchmark, form.benchmark, simulation.facility);

        return simulation;
    }
}
