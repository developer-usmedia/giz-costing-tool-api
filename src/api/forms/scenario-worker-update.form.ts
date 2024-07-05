import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Max, Min } from 'class-validator';

import { ScenarioWorker } from '@domain/entities';

export class ScenarioWorkerUpdateForm {
    @ApiProperty({ example: 500, nullable: true })
    @Min(0)
    @Max(9999999999)
    @IsOptional()
    remunerationIncrease: number;

    public static updateEntity(worker: ScenarioWorker, form: ScenarioWorkerUpdateForm): ScenarioWorker {
        if (form.remunerationIncrease) {
            worker.updateSpecs({ remunerationIncrease: form.remunerationIncrease });
        }
        
        return worker;
    }
}
