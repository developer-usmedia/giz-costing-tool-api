import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/auth/jwt/jwt.guard';
import { BaseController } from '@api/controllers/base.controller';
import {
    ScenarioWorkerDTOFactory,
    ScenarioWorkerListResponse,
    ScenarioWorkerResponse,
} from '@api/dto/scenario-worker.dto';
import { PagingParams } from '@api/paging/paging-params';
import { PagingValidationPipe } from '@api/paging/paging-params.pipe';
import { Paging } from '@api/paging/paging.decorator';
import { ScenarioWorker } from '@domain/entities';
import { ScenarioWorkerService } from '@domain/services/scenario-worker.service';
import { ScenarioService } from '@domain/services/scenario.service';

@ApiTags('scenarios')
@Controller('scenarios')
export class ScenarioController extends BaseController {
    constructor(
        private readonly workerService: ScenarioWorkerService,
        private readonly scenarioService: ScenarioService,
    ) {
        super();
    }

    @Get('/:id/workers')
    @ApiOperation({ summary: 'Get workers from a scenario' })
    @ApiResponse({ status: 404, description: 'The scenario cannot be found' })
    @ApiResponse({ status: 200, description: 'The list of workers on the scenario' })
    @UseGuards(JwtAuthGuard)
    public async workers(
        @Param('id', ParseUUIDPipe) scenarioId: string,
        @Paging('ScenarioWorker', PagingValidationPipe) paging: PagingParams<ScenarioWorker>,
    ): Promise<ScenarioWorkerListResponse> {
        paging.filter = { _scenario: scenarioId } as any;
        const [workers, count] = await this.workerService.findManyPaged(paging);

        return ScenarioWorkerDTOFactory.fromCollection(workers, count, paging);
    }

    @Get('/:scenarioId/workers/:workerId')
    @ApiOperation({ summary: 'Get a single scenario worker by id' })
    @ApiResponse({ status: 404, description: 'The worker cannot be found' })
    @ApiResponse({ status: 200, description: 'The worker record' })
    @UseGuards(JwtAuthGuard)
    public async findBy(
        @Param('scenarioId', ParseUUIDPipe) scenarioId: string,
        @Param('workerId', ParseUUIDPipe) workerId: string,
    ): Promise<ScenarioWorkerResponse> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const entry = await this.workerService.findOneByUid(workerId, { _scenarioId: scenarioId } as any);

        return ScenarioWorkerDTOFactory.fromEntity(entry);
    }
}
