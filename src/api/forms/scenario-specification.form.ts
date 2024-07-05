import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

import { ScenarioSpecification } from '@domain/entities';

export class ScenarioSpecUpdateForm {
    @ApiProperty({ example: 2, minimum: 0, maximum: 100, description: 'In percentage (%)', nullable: true })
    @IsNumber()
    @Min(0)
    @Max(100)
    taxEmployer: number;

    @ApiProperty({ example: 1, minimum: 0, maximum: 100, description: 'In percentage (%)', nullable: true })
    @IsNumber()
    @Min(0)
    @Max(100)
    taxEmployee: number;

    @ApiProperty({ example: 300, minimum: 0, nullable: true })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(9999999999)
    overheadCosts: number;

    @ApiProperty({ example: 1, minimum: 0, nullable: true })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(9999999999)
    remunerationIncrease: number;

    // Convert to database entity from DTO specified above
    public static toEntity(specs: ScenarioSpecification): ScenarioSpecification {
        return new ScenarioSpecification({
            taxEmployee: specs.taxEmployee,
            taxEmployer: specs.taxEmployer,
            overheadCosts: specs.overheadCosts,
            remunerationIncrease: specs.remunerationIncrease,
        });
    }
}
