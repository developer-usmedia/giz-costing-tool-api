import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@api/auth/local/auth.guard';
import { BaseController } from '@api/base.controller';
import { WorkerDTOFactory, WorkerListResponse } from '@api/worker/dto/worker.dto';
import { Paging } from '@common/decorators/paging.decorator';
import { PagingParams } from '@common/paging/paging-params';
import { PagingValidationPipe } from '@common/pipes/paging-params';
import { User, Worker } from '@database/entities';
import { Simulation } from '@database/entities/simulation.entity';
import { SimulationService, WorkerService } from '@domain/services';
import { CreateSimulationDTO } from '../dto/create-simulation.dto';
import { SimulationDTOFactory, SimulationListResponse, SimulationResponse } from '../dto/simulation.dto';

@ApiTags('simulations')
@Controller('simulations')
export class SimulationController extends BaseController {
    constructor(
        private readonly simulationService: SimulationService,
        private readonly workerService: WorkerService,
    ) {
        super();
    }

    @Get('/')
    @ApiOperation({ summary: 'Get a paginated list of simulations' })
    @ApiResponse({ status: 200, description: 'Paged simulations for the current user' })
    @UseGuards(AuthGuard)
    public async index(
        @Paging('Simulation', PagingValidationPipe) paging: PagingParams<Simulation>,
        @Req() req
    ): Promise<SimulationListResponse> {
        paging.filter = { ...paging.filter, user: req.user.id };
        const [simulations, count] = await this.simulationService.findManyPaged(paging);

        return SimulationDTOFactory.fromCollection(simulations, count, paging);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a single simulation by id' })
    @ApiResponse({ status: 404, description: 'The simulation cannot be found' })
    @ApiResponse({ status: 200, description: 'The simulation record' })
    @UseGuards(AuthGuard)
    public async findBy(@Param('id', ParseUUIDPipe) id: string, @Req() req): Promise<SimulationResponse> {
        const simulation = await this.simulationService.findOne({ id: id, user: req.user.id });
        if (!simulation) return this.notFound('Simulation not found');

        return SimulationDTOFactory.fromEntity(simulation);
    }

    @Post('/')
    @ApiOperation({ summary: 'Create a simulation' })
    @ApiResponse({ status: 201, description: 'Created Simulation' })
    @ApiResponse({ status: 404, description: 'User from token not found' })
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    public async create(@Body() simulationForm: CreateSimulationDTO, @Req() req) {
        const newSimulation = CreateSimulationDTO.toEntity(simulationForm, req.user as User);
        const savedSimulation = await this.simulationService.persist(newSimulation);

        return SimulationDTOFactory.fromEntity(savedSimulation);
    }

    @Get('/:id/workers')
    @ApiOperation({ summary: 'Get workers registered on a simulation' })
    @ApiResponse({ status: 404, description: 'The simulation cannot be found' })
    @ApiResponse({ status: 200, description: 'The list of workers on the simulation' })
    @UseGuards(AuthGuard)
    public async workers(
        @Param('id', ParseUUIDPipe) simulationId: string,
        @Paging('Worker', PagingValidationPipe) paging: PagingParams<Worker>,
        @Req() req,
    ): Promise<WorkerListResponse> {
        const simulation = await this.simulationService.findOne({ id: simulationId, user: req.user.id });
        if (!simulation) return this.notFound('Simulation not found');

        paging.filter = { ...paging.filter, simulation: simulationId };
        const [workers, count] = await this.workerService.findManyPaged(paging);

        // TODO: check hateaos links on this endpoint
        return WorkerDTOFactory.fromCollection(workers, count, paging);
    }
}
