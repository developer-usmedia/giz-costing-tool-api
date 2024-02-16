import { IsNumber, IsObject, IsString } from 'class-validator';

import { Simulation } from '@database/entities/simulation.entity';
import { User } from '../user.entity';

/**
 * Database layer DTO used in the creation of a simulation
 */
export class CreateSimulationDTO {
    @IsString()
    name!: string;

    @IsNumber()
    year!: number;

    @IsObject()
    user!: User;

    // Convert to database entity from DTO specification above
    public static toEntity(form: CreateSimulationDTO): Simulation {
        return new Simulation({ name: form.name, year: form.year, user: form.user });
    }
}
