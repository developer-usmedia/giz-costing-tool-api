import { User } from 'database/entities/user.entity';

/**
 * Application layer DTO used in the request response
 */
export interface UserDTO {
  firstName: string;
  lastName: string;
}

export class UserDTOFactory {
  // Get above DTO from database entity
  public static fromEntity(entity: User): { data: UserDTO } {
    return {
      data: {
        firstName: entity.firstName,
        lastName: entity.lastName,
      },
    };
  }

  // Get above DTO from database collection
  public static fromCollection(collection: User[]): { data: UserDTO[] } {
    return {
      data: collection.map((user) => {
        return {
          firstName: user.firstName,
          lastName: user.lastName,
        };
      }),
    };
  }
}
