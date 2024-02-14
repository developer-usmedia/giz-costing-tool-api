import { environment } from '@common/environment/environment';
import { generatePaginationLinks } from '@common/paging/generate-pagination-links';
import { PagingParams } from '@common/paging/paging-params';
import { PagedResponse } from '@common/paging/paging-response';
import { User } from '@database/entities/user.entity';

/**
 * API layer DTO used in the request response
 */
export interface UserDTO {
    email: string;
    firstName: string;
    lastName: string;
}

export interface UserListDTO extends PagedResponse<UserDTO> {}

export class UserDTOFactory {
    // Get above DTO from database entity
    public static fromEntity(entity: User): { data: UserDTO } {
        return {
            data: {
                email: entity.email,
                firstName: entity.firstName,
                lastName: entity.lastName,
            },
        };
    }

    // Get above DTO from database collection
    public static fromCollection(collection: User[], count: number, paging: PagingParams<User>): UserListDTO {
        const userCollectionUrl = new URL(environment.api.url + '/api/users');

        return {
            data: collection.map((user) => {
                return {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
            }),
            links: {
                ...generatePaginationLinks(userCollectionUrl, count, paging),
            },
        };
    }
}
