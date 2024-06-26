import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsObject, ValidateNested } from 'class-validator';

import { ScenarioSpecification } from '@domain/embeddables/scenario-specification.embed';
import { Entry } from '@domain/entities/entry.entity';
import { Scenario } from '@domain/entities/scenario.entity';
import { ScenarioType } from '@domain/enums/scenario-type.enum';
import { ScenarioSpecUpdateForm } from './scenario-specification.form';

export class ScenarioCreateForm {
    @ApiProperty({ nullable: true, example: ScenarioType.CLOSE_GAP })
    @IsEnum(ScenarioType)
    type: ScenarioType;

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
    public static toEntity(form: ScenarioCreateForm, entry: Entry): Scenario {
        return new Scenario({
            type: form.type,
            entry: entry,
            specifications: new ScenarioSpecification({
                employeeTax: form.specifications.employeeTax,
                employerTax: form.specifications.employerTax,
                absoluteIncrease: form.specifications.absoluteIncrease,
            }),
        });
    }
}
