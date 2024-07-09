import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsObject, IsOptional, ValidateNested } from 'class-validator';

import { SCENARIO_TYPE_OPTIONS, ScenarioType } from '@domain/entities';
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
}
