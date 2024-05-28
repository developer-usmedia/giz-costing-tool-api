import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';

import { SIMULATION_LINKS } from '@api/modules/simulation/dto/simulation.links';
import { USER_LINKS } from '@api/modules/user/dto/user.links';
import { WORKER_LINKS } from '@api/modules/worker/dto/worker.links';
import { environment } from './environment';

@Controller()
export class AppController {
    constructor(private readonly healthService: HealthCheckService) {}

    @Get('/')
    public index() {
        return {
            _links: {
                self: { href: `${ environment.api.url }/` },
                users: USER_LINKS.users,
                simulations: SIMULATION_LINKS.simulations,
                workers: WORKER_LINKS.workers,
            },
        };
    }

    @Get('/health')
    @HealthCheck()
    public health(): Promise<HealthCheckResult> {
        return this.healthService.check([]);
    }

    @Get('/health/liveness')
    public liveness(): { message: string } {
        return { message: 'OK' };
    }

    @Get('/health/readiness')
    public readiness(): { message: string } {
        return { message: 'OK' };
    }
}
