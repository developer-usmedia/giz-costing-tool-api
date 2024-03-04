import { IsString } from 'class-validator';

import { User } from '@database/entities/user.entity';

/**
 * API layer DTO used in the creation of a user
 * toEntity -> Convert to database entity from DTO specification
 */
export class CreateUserDTO {
    @IsString()
    email!: string;

    @IsString()
    password!: string;

    public static toEntity(form: CreateUserDTO): User {
        return new User({
            email: form.email,
            password: form.password,
        });
    }
}
