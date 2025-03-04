/* eslint-disable @typescript-eslint/no-empty-object-type */
import { USER_LINKS } from '@api/dto/user.links';
import { generatePaginationLinks } from '@api/paging/generate-pagination-links';
import { resolveLink } from '@api/paging/link-resolver';
import { PagingParams } from '@api/paging/paging-params';
import { CollectionResponse, EntityResponse, HalResponse, Link } from '@api/paging/paging-response';
import { User } from '@domain/entities';

/**
 * API layer DTO used in the request response for users endpoint
 *
 * - Defines DTO
 * - Defines interface of response with DTO
 * - Contains factory class that converts DB layer entity to response
 */

export interface UserDTO extends HalResponse {
    id: string;
    email: string;
    emailVerified: boolean;
    passwordCreatedAt: Date;
    twoFactorEnabled: boolean;
    _links: {
        self: Link;
    };
}

export interface UserListResponse extends CollectionResponse<{ users: UserDTO[] }> {}
export interface UserResponse extends EntityResponse<UserDTO> {}

export class UserDTOFactory {
    public static fromEntity(entity: User): UserResponse {
        return mapEntityToDTO(entity);
    }

    public static fromCollection(collection: User[], count: number, paging: PagingParams<User>): UserListResponse {
        return {
            _embedded: {
                users: collection.map(mapEntityToDTO),
            },
            _links: generatePaginationLinks(USER_LINKS.users, count, paging),
            paging: { index: paging.index, size: paging.size, totalEntities: count, totalPages: Math.ceil(count / paging.size) },
        };
    }
}

const mapEntityToDTO = (entity: User): UserDTO => {
    return {
        id: entity.id,
        email: entity.email,
        emailVerified: entity.emailVerified,
        passwordCreatedAt: entity.passwordCreatedAt,
        twoFactorEnabled: entity.twoFactor.enabled,
        _links: {
            self: { href: resolveLink(USER_LINKS.user, { userId: entity.id }) },
        },
    };
};
