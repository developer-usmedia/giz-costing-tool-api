import { IsString } from 'class-validator';

import { User } from '@domain/entities';

/**
 * API layer DTO used in the creation of a user
 * toEntity -> Convert to database entity from DTO specification
 */
export class UserCreateForm {
    @IsString()
    email!: string;

    @IsString()
    password!: string;

    public static toEntity(form: UserCreateForm): User {
        return new User({
            email: form.email,
            password: form.password,
        });
    }
}
