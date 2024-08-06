/* eslint-disable @typescript-eslint/no-unused-vars, no-console */
import { Controller, Get, Logger, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@api/auth';
import { EntryLivingWageCalculationsService, EntryService, ScenarioWorkerService } from '@domain/services';
import { environment } from 'environment';

@Controller('tests')
@UseGuards(JwtAuthGuard)
export class TestController {
    private readonly logger = new Logger(TestController.name);

    constructor(
        protected readonly workerService: ScenarioWorkerService,
        protected readonly entryService: EntryService,
        protected readonly lwService: EntryLivingWageCalculationsService,
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

    @Get('/recalculate/:entryId')
    public async recalculate(
        @Param('entryId', ParseUUIDPipe) entryId: string,
    ) {
        // Safeguard for accidentals
        if (!environment.api.isLocal) {
            return;
        }

        const entry = await this.entryService.findOneByUid(entryId);


        this.lwService.calculateLwGaps(entry);

        return 'done';
    }
}
