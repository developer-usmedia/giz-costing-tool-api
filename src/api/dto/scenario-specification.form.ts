import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

import { ScenarioSpecification } from '@domain/embeddables/scenario-specification.embed';

export class ScenarioSpecUpdateForm {
    @ApiProperty({ example: 2, minimum: 0, maximum: 100, description: 'In percentage (%)', nullable: true })
    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    employerTax?: number;

    @ApiProperty({ example: 1, minimum: 0, maximum: 100, description: 'In percentage (%)', nullable: true })
    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    employeeTax?: number;

    @ApiProperty({ example: 1, minimum: 0, nullable: true })
    @IsNumber()
    @IsOptional()
    absoluteIncrease?: number;

    // Convert to database entity from DTO specified above
    public static toEntity(specs: ScenarioSpecification): ScenarioSpecification {
        return new ScenarioSpecification({
            employeeTax: specs.employeeTax,
            employerTax: specs.employerTax,
            absoluteIncrease: specs.absoluteIncrease,
        });
    }

    public static updateEntity(specs: ScenarioSpecification, form: ScenarioSpecUpdateForm): ScenarioSpecification {
        if (form.employeeTax) specs.employeeTax = form.employeeTax;
        if (form.employerTax) specs.employerTax = form.employerTax;
        if (form.absoluteIncrease) specs.absoluteIncrease = form.absoluteIncrease;

        return specs;
    }
}
