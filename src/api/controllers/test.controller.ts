/* eslint-disable @typescript-eslint/no-unused-vars, no-console */
import { Controller, Get, Logger, UseGuards } from '@nestjs/common';

import { environment } from 'environment';
import { JwtAuthGuard } from '@api/auth';
import { ScenarioWorkerService } from '@domain/services';

@Controller('tests')
@UseGuards(JwtAuthGuard)
export class TestController {
    private readonly logger = new Logger(TestController.name);

    constructor(
        protected readonly workerService: ScenarioWorkerService,
    ) {}

    @Get('/sql')
    public sql() {
        // Safeguard for accidentals
        if (!environment.api.isLocal) {
            return;
        }

        this.workerService.resetSpecificationsForWorkers('abc');
        this.workerService.resetDistributionForWorkers('abc');
        this.workerService.createMissingWorkers('abc');
    }
}
