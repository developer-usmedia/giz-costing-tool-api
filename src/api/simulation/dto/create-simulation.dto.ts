import { IsNumber, IsString } from 'class-validator';

import { Simulation, User } from '@database/entities';
import { ApiProperty } from '@nestjs/swagger';

/**
 * API layer DTO used in the creation of a user
 */
export class CreateSimulationDTO {
    @ApiProperty({ example: 'My Company Simulation', required: true })
    @IsString()
    name!: string;

    @ApiProperty({ example: 2025, required: true })
    @IsNumber()
    year!: number;

    // Convert to database entity from DTO specification above
    public static toEntity(form: CreateSimulationDTO, user: User): Simulation {
        return new Simulation({
            name: form.name,
            year: form.year,
            user: user,
        });
    }
}
