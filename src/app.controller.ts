import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';

@Controller()
export class AppController {
    constructor(private readonly healthService: HealthCheckService) {}

    @Get('/')
    public hello() {
        return { message: 'Greetings!' };
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
