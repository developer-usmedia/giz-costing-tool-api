import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/auth/jwt/jwt.guard';
import { BaseController } from '@api/base.controller';
import { WorkerDTOFactory, WorkerListResponse } from '@api/worker/dto/worker.dto';
import { Paging } from '@common/decorators/paging.decorator';
import { UserId } from '@common/decorators/userId.decorator.ts';
import { PagingParams } from '@common/paging/paging-params';
import { PagingValidationPipe } from '@common/pipes/paging-params';
import { Worker } from '@database/entities';
import { Simulation } from '@database/entities/simulation.entity';
import { SimulationService } from '@domain/services/simulation.service';
import { UserService } from '@domain/services/user.service';
import { WorkerService } from '@domain/services/worker.service';
import { CreateSimulationDTO } from '../dto/create-simulation.dto';
import { SimulationDTOFactory, SimulationListResponse, SimulationResponse } from '../dto/simulation.dto';

@ApiTags('simulations')
@Controller('simulations')
export class SimulationController extends BaseController {
    constructor(
        private readonly userService: UserService,
        private readonly simulationService: SimulationService,
        private readonly workerService: WorkerService,
    ) {
        super();
    }

    @Get('/')
    @ApiOperation({ summary: 'Get a paginated list of simulations' })
    @ApiResponse({ status: 200, description: 'Paged simulations for the current user' })
    @UseGuards(JwtAuthGuard)
    public async index(
        @Paging('Simulation', PagingValidationPipe) paging: PagingParams<Simulation>,
        @UserId() userId: string,
    ): Promise<SimulationListResponse> {
        paging.filter = { ...paging.filter, user: userId };
        const [simulations, count] = await this.simulationService.findManyPaged(paging);

        return SimulationDTOFactory.fromCollection(simulations, count, paging);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a single simulation by id' })
    @ApiResponse({ status: 404, description: 'The simulation cannot be found' })
    @ApiResponse({ status: 200, description: 'The simulation record' })
    @UseGuards(JwtAuthGuard)
    public async findBy(@Param('id', ParseUUIDPipe) id: string, @UserId() userId: string): Promise<SimulationResponse> {
        const simulation = await this.simulationService.findOne({ id: id, user: userId });
        if (!simulation) return this.notFound('Simulation not found');

        return SimulationDTOFactory.fromEntity(simulation);
    }

    @Post('/')
    @ApiOperation({ summary: 'Create a simulation' })
    @ApiResponse({ status: 201, description: 'Created Simulation' })
    @ApiResponse({ status: 404, description: 'User from token not found' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    public async create(@Body() simulationForm: CreateSimulationDTO, @UserId() userId: string) {
        const user = await this.userService.findOne({ id: userId });
        if (!user) this.clientError('User not found');

        const newSimulation = CreateSimulationDTO.toEntity(simulationForm, user);
        const savedSimulation = await this.simulationService.persist(newSimulation);

        return SimulationDTOFactory.fromEntity(savedSimulation);
    }

    @Get('/:id/workers')
    @ApiOperation({ summary: 'Get workers registered on a simulation' })
    @ApiResponse({ status: 404, description: 'The simulation cannot be found' })
    @ApiResponse({ status: 200, description: 'The list of workers on the simulation' })
    @UseGuards(JwtAuthGuard)
    public async workers(
        @Param('id', ParseUUIDPipe) simulationId: string,
        @Paging('Worker', PagingValidationPipe) paging: PagingParams<Worker>,
        @UserId() userId: string,
    ): Promise<WorkerListResponse> {
        const simulation = await this.simulationService.findOne({ id: simulationId, user: userId });
        if (!simulation) return this.notFound('Simulation not found');

        paging.filter = { ...paging.filter, simulation: simulationId };
        const [workers, count] = await this.workerService.findManyPaged(paging);

        return WorkerDTOFactory.fromCollection(workers, count, paging);
    }
}
