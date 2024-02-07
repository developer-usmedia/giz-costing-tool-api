import { IsString } from 'class-validator';

import { User } from 'database/entities/user.entity';

/**
 * Application layer DTO used in the updating of a user
 */
export class UpdateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  // Convert to database entity from DTO specified above
  public static toEntity(user: User = new User(), form: UpdateUserDTO): User {
    user.firstName = form.firstName;
    user.lastName = form.lastName;

    return user;
  }
}
