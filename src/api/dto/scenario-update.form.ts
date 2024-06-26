import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { Scenario } from '@domain/entities/scenario.entity';
import { ScenarioSpecUpdateForm } from './scenario-specification.form';

export class ScenarioUpdateForm {
    @ApiProperty({ nullable: true, example: {} })
    @IsObject()
    @ValidateNested()
    @Type(() => ScenarioSpecUpdateForm)
    specifications: ScenarioSpecUpdateForm;

    // @ApiProperty({ nullable: true, example: {} })
    // @ValidateNested()
    // @Type(() => DistributionSpecUpdateForm)
    // distributions: DistributionSpecUpdateForm;

    // Convert to database entity from DTO specified above
    public static updateEntity(scenario: Scenario, form: ScenarioUpdateForm): Scenario {
        if (form.specifications) {
            scenario.specifications = ScenarioSpecUpdateForm.updateEntity(scenario.specifications, form.specifications);
        }

        return scenario;
    }
}
