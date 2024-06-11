import { environment } from '@app/environment';

export const WORKER_LINKS = {
    workers: {
        href: `${environment.api.url}/api/workers{?index,size,sort}`,
        templated: true,
    },
    worker: {
        href: `${environment.api.url}/api/workers/{workerId}`,
        templated: true,
    },
};
