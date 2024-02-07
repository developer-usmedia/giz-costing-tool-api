import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { User } from 'database/entities/user.entity';

/**
 * Application layer DTO used in the creation of a user
 */
export class CreateUserDTO {
  @ApiProperty({ example: 'John', required: true })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', required: true })
  @IsString()
  lastName: string;

  // Convert to database entity from DTO specification above
  public static toEntity(user: User = new User(), form: CreateUserDTO): User {
    user.firstName = form.firstName;
    user.lastName = form.lastName;

    return user;
  }
}
