import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/auth';
import { BaseController } from '@api/controllers';
import { Paging } from '@api/decorators';
import { WorkerDTOFactory, WorkerListResponse, WorkerResponse } from '@api/dto';
import { WorkersResetForm } from '@api/forms';
import { ScenarioWorkerUpdateForm } from '@api/forms/scenario-worker-update.form';
import { PagingParams } from '@api/paging/paging-params';
import { PagingValidationPipe } from '@api/paging/paging-params.pipe';
import { ScenarioWorker } from '@domain/entities';
import { EntryService, ScenarioWorkerService } from '@domain/services';

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

    @Patch('/:workerId')
    @ApiOperation({ summary: 'Update a worker' })
    @ApiResponse({ status: 201, description: 'Updated worker' })
    @ApiResponse({ status: 404, description: 'Entry or worker not found' })
    public async updateScenario(
        @Param('entryId', ParseUUIDPipe) entryId: string,
        @Param('workerId', ParseUUIDPipe) workerId: string,
        @Body() updateWorkerForm: ScenarioWorkerUpdateForm,
    ): Promise<WorkerResponse> {
        /* eslint-disable @typescript-eslint/no-unsafe-argument */
        const entry = await this.entryService.findOne({ _id: entryId } as any);
        const original = await this.workerService.findOne({ _id: workerId, _scenario: entry.scenario } as any);
        /* eslint-enable @typescript-eslint/no-unsafe-argument */
        const updated = ScenarioWorkerUpdateForm.updateEntity(original, updateWorkerForm);
        const saved = await this.workerService.persist(updated);

        return WorkerDTOFactory.fromEntity(saved);
    }

}
