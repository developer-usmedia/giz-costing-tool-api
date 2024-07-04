import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/auth';
import { BaseController } from '@api/controllers';
import { WorkerDTOFactory, WorkerListResponse } from '@api/dto';
import { Paging } from '@api/decorators';
import { PagingParams } from '@api/paging/paging-params';
import { PagingValidationPipe } from '@api/paging/paging-params.pipe';
import { ScenarioWorker } from '@domain/entities';
import { EntryService, ScenarioWorkerService } from '@domain/services';
import { WorkersResetForm } from '@api/forms';

@ApiTags('entries')
@Controller('entries/:entryId/workers')
@UseGuards(JwtAuthGuard)
export class EntryWorkerController extends BaseController {
    constructor(
        private readonly entryService: EntryService,
        private readonly workerService: ScenarioWorkerService,
    ) {
        super();
    }

    @Get('/')
    @ApiOperation({ summary: 'Get workers registered on a entry' })
    @ApiResponse({ status: 404, description: 'The entry cannot be found' })
    @ApiResponse({ status: 200, description: 'The list of workers on the entry' })
    public async workers(
        @Param('entryId', ParseUUIDPipe) entryId: string,
        @Paging('ScenarioWorker', PagingValidationPipe) paging: PagingParams<ScenarioWorker>,
    ): Promise<WorkerListResponse> {
        const entry = await this.entryService.findOneByUid(entryId);

        if(!entry.scenario) {
            throw this.clientError('First enable a scenario before getting workers');
        }

        paging.filter = { ...paging.filter, _scenario: entry.scenario } as any; // TODO: this needs fixing
        const [workers, count] = await this.workerService.findManyPaged(paging);

        // TODO: check hateaos links on this endpoint
        return WorkerDTOFactory.fromCollection(workers, count, paging);
    }

    @Post('/reset')
    @ApiOperation({ summary: 'Reset any specifications or distribution settings on all workers' })
    @ApiResponse({ status: 404, description: 'The entry cannot be found' })
    @ApiResponse({ status: 200, description: 'The reset has been done' })
    public async reset(
        @Param('entryId', ParseUUIDPipe) entryId: string,
        @Body() form: WorkersResetForm,
    ): Promise<void> {
        const entry = await this.entryService.findOneByUid(entryId, { populate: ['_scenario'] as any });
        if (!entry.scenario) {
            return this.clientError('Entry has no scenario selected.');
        }

        if (form.type === 'specification' || form.type === 'all') {
            await this.workerService.resetSpecificationsForWorkers(entry.scenario.id);
        }

        if (form.type === 'distribution' || form.type === 'all') {
            await this.workerService.resetSpecificationsForWorkers(entry.scenario.id);
        }
    }
}
