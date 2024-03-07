import { environment } from '@common/environment/environment';
import { generatePaginationLinks } from '@common/paging/generate-pagination-links';
import { PagingParams } from '@common/paging/paging-params';
import { EntityResponse, PagedEntityResponse } from '@common/paging/paging-response';
import { User } from '@database/entities/user.entity';

/**
 * API layer DTO used in the request response for users endpoint
 *
 * - Defines DTO
 * - Defines interface of response with DTO
 * - Contains factory class that converts DB layer entity to response
 */

export interface UserDTO { // This is also used to store the user in session (local.strategy.ts)
    id: string;
    email: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
}

export interface UserListResponse extends PagedEntityResponse<'users', UserDTO> {}
export interface UserResponse extends EntityResponse<'user', UserDTO> {}

export class UserDTOFactory {
    public static fromEntity(entity: User): UserResponse {
        return {
            user: mapEntityToDTO(entity),
        };
    }

    public static fromCollection(collection: User[], count: number, paging: PagingParams<User>): UserListResponse {
        const userCollectionUrl = new URL(environment.api.url + '/api/users');

        return {
            users: collection.map(mapEntityToDTO),
            links: generatePaginationLinks(userCollectionUrl, count, paging),
        };
    }
}

const mapEntityToDTO = (entity: User): UserDTO => {

    return {
        id: entity.id,
        email: entity.email,
        emailVerified: entity.emailVerified,
        twoFactorEnabled: entity.twoFactor.enabled,
    };
};
