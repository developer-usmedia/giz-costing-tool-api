import { environment } from '@app/environment';

export const USER_LINKS = {
    users: {
        href: `${environment.api.url}/api/users{?index,size,sort}`,
        templated: true,
    },
    user: {
        href: `${environment.api.url}/api/users/{userId}`,
        templated: true,
    },
};
