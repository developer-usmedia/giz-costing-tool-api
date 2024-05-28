import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GlobalGuard } from '@api/modules/auth/login/global.guard';
import { BaseController } from '@api/modules/base.controller';
import { SimulationDTOFactory, SimulationListResponse, SimulationResponse } from '@api/modules/simulation/dto/simulation.dto';
import { CreateSimulationDTO } from '@api/modules/simulation/form/create-simulation.form';
import { UpdateSimulationForm } from '@api/modules/simulation/form/update-simulation.form';
import { WorkerDTOFactory, WorkerListResponse } from '@api/modules/worker/dto/worker.dto';
import { Paging } from '@api/nestjs/decorators/paging.decorator';
import { User as UserDecorator } from '@api/nestjs/decorators/user.decorator';
import { PagingValidationPipe } from '@api/nestjs/pipes/paging-params';
import { PagingParams } from '@api/paging/paging-params';
import { Simulation } from '@domain/entities/simulation.entity';
import { Worker } from '@domain/entities/worker.entity';
import { SimulationService } from '@domain/services/simulation.service';
import { UserService } from '@domain/services/user.service';
import { WorkerService } from '@domain/services/worker.service';

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
    @UseGuards(GlobalGuard)
    public async index(
        @Paging('Simulation', PagingValidationPipe) paging: PagingParams<Simulation>,
    ): Promise<SimulationListResponse> {
        const [simulations, count] = await this.simulationService.findManyPaged(paging);

        return SimulationDTOFactory.fromCollection(simulations, count, paging);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a single simulation by id' })
    @ApiResponse({ status: 404, description: 'The simulation cannot be found' })
    @ApiResponse({ status: 200, description: 'The simulation record' })
    @UseGuards(GlobalGuard)
    public async findBy(@Param('id', ParseUUIDPipe) id: string): Promise<SimulationResponse> {
        const simulation = await this.simulationService.findOneByUid(id);

        return SimulationDTOFactory.fromEntity(simulation);
    }

    @Post('/')
    @ApiOperation({ summary: 'Create a simulation' })
    @ApiResponse({ status: 201, description: 'Created Simulation' })
    @ApiResponse({ status: 404, description: 'User from token not found' })
    @UseGuards(GlobalGuard)
    @UsePipes(ValidationPipe)
    public async create(@Body() simulationForm: CreateSimulationDTO, @UserDecorator() sessionUser: { id: string }): Promise<SimulationResponse> {
        const user = await this.userService.findOneByUid(sessionUser.id);
        const newSimulation = CreateSimulationDTO.toEntity(simulationForm, user);
        const savedSimulation = await this.simulationService.persist(newSimulation);

        return SimulationDTOFactory.fromEntity(savedSimulation);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Update a simulation' })
    @ApiResponse({ status: 201, description: 'Updated Simulation' })
    @ApiResponse({ status: 404, description: 'Simulation to update not found' })
    @UseGuards(GlobalGuard)
    @UsePipes(ValidationPipe)
    public async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateSimulationForm: UpdateSimulationForm,
    ): Promise<SimulationResponse> {
        const original = await this.simulationService.findOneByUid(id);
        const updated = UpdateSimulationForm.toEntity(original, updateSimulationForm);
        const saved = await this.simulationService.persist(updated);

        return SimulationDTOFactory.fromEntity(saved);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a simulation' })
    @ApiResponse({ status: 200, description: 'Deleted simulation' })
    @ApiResponse({ status: 404, description: 'Simulation not found' })
    @UseGuards(GlobalGuard)
    @UsePipes(ValidationPipe)
    public async destroy(@Param('id', ParseUUIDPipe) id: string): Promise<SimulationResponse> {
        const simulation = await this.simulationService.findOneByUid(id);
        const deleted = await this.simulationService.remove(simulation);

        return SimulationDTOFactory.fromEntity(deleted);
    }

    @Get('/:id/workers')
    @ApiOperation({ summary: 'Get workers registered on a simulation' })
    @ApiResponse({ status: 404, description: 'The simulation cannot be found' })
    @ApiResponse({ status: 200, description: 'The list of workers on the simulation' })
    @UseGuards(GlobalGuard)
    public async workers(
        @Param('id', ParseUUIDPipe) simulationId: string,
        @Paging('Worker', PagingValidationPipe) paging: PagingParams<Worker>,
    ): Promise<WorkerListResponse> {
        const simulation = await this.simulationService.findOneByUid(simulationId);
        paging.filter = { ...paging.filter, simulation: simulation.id };
        const [workers, count] = await this.workerService.findManyPaged(paging);

        // TODO: check hateaos links on this endpoint
        return WorkerDTOFactory.fromCollection(workers, count, paging);
    }
}
