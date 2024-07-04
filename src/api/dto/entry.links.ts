import { environment } from 'environment';

export const ENTRY_LINKS = {
    entries: {
        href: `${environment.api.url}/api/entries{?index,size,sort}`,
        templated: true,
    },
    entry: {
        href: `${environment.api.url}/api/entries/{entryId}`,
        templated: true,
    },
    workers: {
        href: `${environment.api.url}/api/entries/{entryId}/workers`,
        templated: true,
    },
};
