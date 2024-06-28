import { environment } from '@app/environment';

export const SCENARIO_WORKER_LINKS = {
    workers: {
        href: `${environment.api.url}/api/scenarios/{scenarioId}/workers{?index,size,sort}`,
        templated: true,
    },
    worker: {
        href: `${environment.api.url}/api/scenarios/{scenarioId}/workers/{workerId}`,
        templated: true,
    },
};
