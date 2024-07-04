import { environment } from 'environment';

export const WORKER_LINKS = {
    workers: {
        href: `${environment.api.url}/api/entries/{entryId}/workers{?index,size,sort}`,
        templated: true,
    },
    worker: {
        href: `${environment.api.url}/api/entries/{entryId}/workers/{workerId}`,
        templated: true,
    },
};
