import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';

import { ENTRY_LINKS } from '@api/dto/entry.links';
import { USER_LINKS } from '@api/dto/user.links';
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
                entries: ENTRY_LINKS.entries,
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
