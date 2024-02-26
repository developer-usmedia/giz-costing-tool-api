import { Controller, Get, NotFoundException, Param, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/auth/jwt/jwt.guard';
import { WorkerDTOFactory, WorkerListResponse } from '@api/worker/dto/worker.dto';
import { Paging } from '@common/decorators/paging.decorator';
import { PagingParams } from '@common/paging/paging-params';
import { PagingValidationPipe } from '@common/pipes/paging-params';
import { Worker } from '@database/entities';
import { Simulation } from '@database/entities/simulation.entity';
import { SimulationService } from '@domain/services/simulation.service';
import { WorkerService } from '@domain/services/worker.service';
import { SimulationDTOFactory, SimulationListResponse, SimulationResponse } from '../dto/simulation.dto';

@ApiTags('simulations')
@Controller('simulations')
export class SimulationController {
    constructor(
        private readonly simulationService: SimulationService,
        private readonly workerService: WorkerService,
    ) {}

    @Get('/')
    @ApiResponse({ status: 200, description: 'Simulations for the current user' })
    @UseGuards(JwtAuthGuard)
    public async index(
        @Paging('Simulation', PagingValidationPipe) paging: PagingParams<Simulation>,
        @Req() req,
    ): Promise<SimulationListResponse> {
        paging.filter = { ...paging.filter, user: req.user.userId };
        const [simulations, count] = await this.simulationService.findManyPaged(paging);

        return SimulationDTOFactory.fromCollection(simulations, count, paging);
    }

    @Get('/:id')
    @ApiResponse({ status: 404, description: 'The simulation cannot be found' })
    @ApiResponse({ status: 200, description: 'The simulation record' })
    @UseGuards(JwtAuthGuard)
    public async findBy(@Param('id', ParseUUIDPipe) id: string, @Req() req): Promise<SimulationResponse> {
        const simulation = await this.simulationService.findOne({ id: id, user: req.user.userId });
        if (!simulation) throw new NotFoundException();

        return SimulationDTOFactory.fromEntity(simulation);
    }

    @Get('/:id/workers')
    @ApiResponse({ status: 404, description: 'The simulation cannot be found' })
    @ApiResponse({ status: 200, description: 'The list of workers on the simulation' })
    @UseGuards(JwtAuthGuard)
    public async workers(
        @Param('id', ParseUUIDPipe) simulationId: string,
        @Paging('Worker', PagingValidationPipe) paging: PagingParams<Worker>,
        @Req() req,
    ): Promise<WorkerListResponse> {
        const simulation = await this.simulationService.findOne({ id: simulationId, user: req.user.userId });
        if (!simulation) throw new NotFoundException();

        paging.filter = { ...paging.filter, simulation: simulationId };
        const [workers, count] = await this.workerService.findManyPaged(paging);

        return WorkerDTOFactory.fromCollection(workers, count, paging);
    }
}
