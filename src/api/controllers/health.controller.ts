import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor(
        private readonly healthService: HealthCheckService,
    ) {}

    @Get('/')
    @HealthCheck()
    public health(): Promise<HealthCheckResult> {
        return this.healthService.check([]);
    }

    @Get('/liveness')
    public liveness(): { message: string } {
        return { message: 'OK' };
    }

    @Get('/readiness')
    public readiness(): { message: string } {
        return { message: 'OK' };
    }
}
