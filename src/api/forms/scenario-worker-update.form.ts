import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Max, Min, ValidateNested } from 'class-validator';

import { ScenarioWorker } from '@domain/entities';

export class ScenarioWorkerDistroUpdateForm {
    @ApiProperty({ example: 1, minimum: 0, maximum: 100, nullable: true })
    @Min(0)
    @Max(100)
    bonusesPerc?: number;

    @ApiProperty({ example: 1, minimum: 0, maximum: 100, nullable: true })
    @Min(0)
    @Max(100)
    ikbHousingPerc?: number;

    @ApiProperty({ example: 1, minimum: 0, maximum: 100, nullable: true })
    @Min(0)
    @Max(100)
    ikbFoodPerc?: number;

    @ApiProperty({ example: 1, minimum: 0, maximum: 100, nullable: true })
    @Min(0)
    @Max(100)
    ikbTransportPerc?: number;

    @ApiProperty({ example: 1, minimum: 0, maximum: 100, nullable: true })
    @Min(0)
    @Max(100)
    ikbHealthcarePerc?: number;

    @ApiProperty({ example: 1, minimum: 0, maximum: 100, nullable: true })
    @Min(0)
    @Max(100)
    ikbChildcarePerc?: number;

    @ApiProperty({ example: 1, minimum: 0, maximum: 100, nullable: true })
    @Min(0)
    @Max(100)
    ikbChildEducationPerc?: number;
}

export class ScenarioWorkerUpdateForm {
    @ApiProperty({ example: 500, nullable: true })
    @Min(0)
    @Max(9999999999)
    @IsOptional()
    remunerationIncrease: number;

    @ApiProperty({ nullable: true })
    @ValidateNested()
    @Type(() => ScenarioWorkerDistroUpdateForm)
    @IsOptional()
    distribution: ScenarioWorkerDistroUpdateForm;

    public static updateEntity(worker: ScenarioWorker, form: ScenarioWorkerUpdateForm): ScenarioWorker {
        if (form.remunerationIncrease) {
            worker.updateSpecs({ remunerationIncrease: form.remunerationIncrease });
        }

        if(form.distribution) {
            worker.updateDistro({
                bonusesPerc: form.distribution.bonusesPerc,
                ikbHousingPerc: form.distribution.ikbHousingPerc,
                ikbFoodPerc: form.distribution.ikbFoodPerc,
                ikbTransportPerc: form.distribution.ikbTransportPerc,
                ikbHealthcarePerc: form.distribution.ikbHealthcarePerc,
                ikbChildcarePerc: form.distribution.ikbChildcarePerc,
                ikbChildEducationPerc: form.distribution.ikbChildEducationPerc,
            });
        }
        
        return worker;
    }
}
