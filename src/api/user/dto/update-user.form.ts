import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { User } from '@database/entities/user.entity';

/**
 * API layer DTO used in the updating of a user
 */
export class UpdateUserDTO {
  @ApiProperty({ example: 'Jane', required: true })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', required: true })
  @IsString()
  lastName: string;

  // Convert to database entity from DTO specified above
  public static toEntity(user: User, form: UpdateUserDTO): User {
    user.firstName = form.firstName;
    user.lastName = form.lastName;

    return user;
  }
}
