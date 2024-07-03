import { ApiProperty } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';

import { ScenarioDistribution } from '@domain/entities';

export class ScenarioDistroCreateForm {
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

    // Convert to database entity from DTO specified above
    public static toEntity(specs: ScenarioDistroCreateForm): ScenarioDistribution {
        return new ScenarioDistribution({
            bonusesPerc: specs.bonusesPerc,
            ikbHousingPerc: specs.ikbHousingPerc,
            ikbFoodPerc: specs.ikbFoodPerc,
            ikbTransportPerc: specs.ikbTransportPerc,
            ikbHealthcarePerc: specs.ikbHealthcarePerc,
            ikbChildcarePerc: specs.ikbChildcarePerc,
            ikbChildEducationPerc: specs.ikbChildEducationPerc,
        });
    }
}
