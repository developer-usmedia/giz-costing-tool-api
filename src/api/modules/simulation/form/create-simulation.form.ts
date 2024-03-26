import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { SimulationFacility } from '@domain/embeddables/simulation-facility.embed';
import { Simulation } from '@domain/entities/simulation.entity';
import { User } from '@domain/entities/user.entity';

/**
 * API layer DTO used in the creation of a user
 */
export class CreateSimulationDTO {
    @ApiProperty({ example: 'My Facility', required: true })
    @IsString()
    facilityName: string;

    @ApiProperty({ example: 2031, minLength: 3, maxLength: 3, required: true })
    @IsNumber()
    year: number;

    @ApiProperty({ example: 'NLD', minLength: 2, maxLength: 3, required: true })
    @IsString()
    countryCode: string;

    // Convert to database entity from DTO specification above
    public static toEntity(form: CreateSimulationDTO, user: User): Simulation {
        return new Simulation({
            year: form.year,
            user: user,
            facility: new SimulationFacility({
                name: form.facilityName,
                countryCode: form.countryCode,
            }),
        });
    }
}