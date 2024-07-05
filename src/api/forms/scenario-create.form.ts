import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsObject, IsOptional, ValidateNested } from 'class-validator';

import { Entry, SCENARIO_TYPE_OPTIONS, Scenario, ScenarioType } from '@domain/entities';
import { ScenarioDistroCreateForm } from './scenario-distribution.form';
import { ScenarioSpecUpdateForm } from './scenario-specification.form';

export class ScenarioCreateForm {
    @ApiProperty({ nullable: true, example: SCENARIO_TYPE_OPTIONS[0] })
    @IsIn(SCENARIO_TYPE_OPTIONS)
    type: ScenarioType;

    @ApiProperty({ nullable: true, example: {} })
    @IsObject()
    @ValidateNested()
    @Type(() => ScenarioSpecUpdateForm)
    specifications: ScenarioSpecUpdateForm;

    @ApiProperty({ nullable: true, example: {} })
    @ValidateNested()
    @Type(() => ScenarioDistroCreateForm)
    @IsOptional()
    distributions: ScenarioDistroCreateForm;

    // Convert to database entity from DTO specified above
    public static toEntity(form: ScenarioCreateForm, entry: Entry): Scenario {
        return new Scenario({
            type: form.type,
            entry: entry,
            specs: {
                taxEmployee: form.specifications.taxEmployee,
                taxEmployer: form.specifications.taxEmployer,
                overheadCosts: form.specifications.overheadCosts ?? 0, // TODO: remove when added to UI
                remunerationIncrease: form.specifications.remunerationIncrease,
            },
            distro: form.distributions ? {
                bonusesPerc: form.distributions?.bonusesPerc,
                ikbHousingPerc: form.distributions?.ikbHousingPerc,
                ikbFoodPerc: form.distributions?.ikbFoodPerc,
                ikbTransportPerc: form.distributions?.ikbTransportPerc,
                ikbHealthcarePerc: form.distributions?.ikbHealthcarePerc,
                ikbChildcarePerc: form.distributions?.ikbChildcarePerc,
                ikbChildEducationPerc: form.distributions?.ikbChildEducationPerc,
            } : undefined,
        });
    }
}