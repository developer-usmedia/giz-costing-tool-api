import { IsString } from 'class-validator';

import { User } from 'database/entities/user.entity';

/**
 * Application layer DTO used in the creation of a user
 */
export class CreateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  // Convert to database entity from DTO specification above
  public static toEntity(user: User = new User(), form: CreateUserDTO): User {
    user.firstName = form.firstName;
    user.lastName = form.lastName;

    return user;
  }
}
