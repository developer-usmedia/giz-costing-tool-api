import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { Scenario } from '@domain/entities';
import { ScenarioDistroCreateForm } from './scenario-distribution.form';
import { ScenarioSpecUpdateForm } from './scenario-specification.form';

export class ScenarioUpdateForm {
    @ApiProperty({ nullable: true })
    @IsObject()
    @ValidateNested()
    @Type(() => ScenarioSpecUpdateForm)
    @IsOptional()
    specifications: ScenarioSpecUpdateForm;

    @ApiProperty({ nullable: true })
    @ValidateNested()
    @Type(() => ScenarioDistroCreateForm)
    @IsOptional()
    distributions: ScenarioDistroCreateForm;

    // Convert to database entity from DTO specified above
    public static updateEntity(scenario: Scenario, form: ScenarioUpdateForm): Scenario {
        if (form.specifications) {
            scenario.updateSpecs({
                taxEmployee: form.specifications.taxEmployee ?? scenario.specs.taxEmployee,
                taxEmployer: form.specifications.taxEmployer ?? scenario.specs.taxEmployer,
                overheadCosts: form.specifications.overheadCosts ?? scenario.specs.overheadCosts,
                remunerationIncrease: form.specifications.remunerationIncrease ?? scenario.specs.remunerationIncrease,
            });
        }

        if (form.distributions) {
            scenario.updateDistro({
                bonusesPerc: form.distributions.bonusesPerc ?? scenario.distro.bonusesPerc,
                ikbHousingPerc: form.distributions.ikbHousingPerc ?? scenario.distro.ikbHousingPerc,
                ikbFoodPerc: form.distributions.ikbFoodPerc ?? scenario.distro.ikbFoodPerc,
                ikbTransportPerc: form.distributions.ikbTransportPerc ?? scenario.distro.ikbTransportPerc,
                ikbHealthcarePerc: form.distributions.ikbHealthcarePerc ?? scenario.distro.ikbHealthcarePerc,
                ikbChildcarePerc: form.distributions.ikbChildcarePerc ?? scenario.distro.ikbChildcarePerc,
                ikbChildEducationPerc: form.distributions.ikbChildEducationPerc ?? scenario.distro.ikbChildcarePerc,
            });
        }

        return scenario;
    }
}
