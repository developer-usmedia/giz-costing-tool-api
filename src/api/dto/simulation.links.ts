import { environment } from '@app/environment';

export const SIMULATION_LINKS = {
    simulations: {
        href: `${environment.api.url}/api/simulations{?index,size,sort}`,
        templated: true,
    },
    simulation: {
        href: `${environment.api.url}/api/simulations/{simulationId}`,
        templated: true,
    },
    workers: {
        href: `${environment.api.url}/api/simulations/{simulationId}/workers`,
        templated: true,
    },
};
