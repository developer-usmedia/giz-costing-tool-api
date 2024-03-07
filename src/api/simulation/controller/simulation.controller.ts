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

import { AuthGuard } from '@api/auth/local/auth.guard';
import { BaseController } from '@api/base.controller';
import { UserDTO } from '@api/user/dto/user.dto';
import { WorkerDTOFactory, WorkerListResponse } from '@api/worker/dto/worker.dto';
import { Paging } from '@common/decorators/paging.decorator';
import { User as UserDecorator } from '@common/decorators/user.decorator';
import { PagingParams } from '@common/paging/paging-params';
import { PagingValidationPipe } from '@common/pipes/paging-params';
import { Worker } from '@database/entities';
import { Simulation } from '@database/entities/simulation.entity';
import { SimulationService, UserService, WorkerService } from '@domain/services';
import { CreateSimulationDTO } from '../dto/create-simulation.dto';
import { SimulationDTOFactory, SimulationListResponse, SimulationResponse } from '../dto/simulation.dto';
import { UpdateSimulationForm } from '../dto/update-simulation.form';

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
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
    public async findBy(@Param('id', ParseUUIDPipe) id: string): Promise<SimulationResponse> {
        const simulation = await this.simulationService.findOneByUid(id);

        return SimulationDTOFactory.fromEntity(simulation);
    }

    @Post('/')
    @ApiOperation({ summary: 'Create a simulation' })
    @ApiResponse({ status: 201, description: 'Created Simulation' })
    @ApiResponse({ status: 404, description: 'User from token not found' })
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    public async create(@Body() simulationForm: CreateSimulationDTO, @UserDecorator() sessionUser: UserDTO) {
        const user = await this.userService.findOneByUid(sessionUser.id);
        const newSimulation = CreateSimulationDTO.toEntity(simulationForm, user);
        const savedSimulation = await this.simulationService.persist(newSimulation);

        return SimulationDTOFactory.fromEntity(savedSimulation);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Update a simulation' })
    @ApiResponse({ status: 201, description: 'Updated Simulation' })
    @ApiResponse({ status: 404, description: 'Simulation to update not found' })
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
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
