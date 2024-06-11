import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UnprocessableEntityException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/auth/jwt/jwt.guard';
import { BaseController } from '@api/controllers/base.controller';
import { SimulationCreateForm } from '@api/dto/simulation-create.form';
import { SimulationUpdateForm } from '@api/dto/simulation-update.form';
import { SimulationDTOFactory, SimulationListResponse, SimulationResponse } from '@api/dto/simulation.dto';
import { WorkerDTOFactory, WorkerListResponse } from '@api/dto/worker.dto';
import { CurrentUser } from '@api/nestjs/decorators/user.decorator';
import { PagingParams, Sort } from '@api/paging/paging-params';
import { PagingValidationPipe } from '@api/paging/paging-params.pipe';
import { Paging } from '@api/paging/paging.decorator';
import { Simulation } from '@domain/entities/simulation.entity';
import { User } from '@domain/entities/user.entity';
import { Worker } from '@domain/entities/worker.entity';
import { SimulationImportException } from '@domain/services/import/dto/import-validation.dto';
import { SimulationImporter } from '@domain/services/import/simulation-importer';
import { SimulationService } from '@domain/services/simulation.service';
import { UserService } from '@domain/services/user.service';
import { WorkerService } from '@domain/services/worker.service';
import { FileHelper } from '@domain/utils/file-helper';

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
    ): Promise<SimulationListResponse> {
        paging.sort = { _updatedAt: Sort.DESC };
        const [simulations, count] = await this.simulationService.findManyPaged(paging);

        return SimulationDTOFactory.fromCollection(simulations, count, paging);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a single simulation by id' })
    @ApiResponse({ status: 404, description: 'The simulation cannot be found' })
    @ApiResponse({ status: 200, description: 'The simulation record' })
    @UseGuards(JwtAuthGuard)
    public async findBy(@Param('id', ParseUUIDPipe) id: string): Promise<SimulationResponse> {
        const simulation = await this.simulationService.findOneByUid(id);

        return SimulationDTOFactory.fromEntity(simulation);
    }

    @Post('/')
    @ApiOperation({ summary: 'Create a simulation' })
    @ApiResponse({ status: 201, description: 'Created Simulation' })
    @ApiResponse({ status: 404, description: 'User from token not found' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    public async create(@Body() simulationForm: SimulationCreateForm, @CurrentUser() user: User): Promise<SimulationResponse> {
        const newSimulation = SimulationCreateForm.toEntity(simulationForm, user);
        const savedSimulation = await this.simulationService.persist(newSimulation);

        return SimulationDTOFactory.fromEntity(savedSimulation);
    }

    @Post('/import')
    @ApiOperation({ summary: 'Import a simulation via SM Excel export' })
    @ApiResponse({ status: 201, description: 'Imported Simulation' })
    @ApiResponse({ status: 422, description: 'Errors found while importing' })
    @UseInterceptors(
        FileHelper.createFileInterceptor(SimulationImporter.ACCEPTED_FILE_TYPE, SimulationImporter.FILE_SIZE_LIMIT),
    )
    @UseGuards(JwtAuthGuard)
    public async import(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() sessionUser: User,
    ): Promise<any> {
        if (!file) {
            throw new UnprocessableEntityException('No file uploaded');
        }

        const user = await this.userService.findOneByUid(sessionUser.id);
        const importer = new SimulationImporter(file.originalname, file.buffer, user);
        await importer.validateSheetStructure();

        if (importer.errors.length > 0) {
            throw new SimulationImportException(importer.errors);
        }

        await importer.doImport();

        if (importer.errors.length > 0) {
            throw new SimulationImportException(importer.errors);
        }

        const savedSimulation = await this.simulationService.persist(importer.simulation);
        return SimulationDTOFactory.fromEntity(savedSimulation);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Update a simulation' })
    @ApiResponse({ status: 201, description: 'Updated Simulation' })
    @ApiResponse({ status: 404, description: 'Simulation to update not found' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    public async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateSimulationForm: SimulationUpdateForm,
    ): Promise<SimulationResponse> {
        const original = await this.simulationService.findOneByUid(id);
        const updated = SimulationUpdateForm.toEntity(original, updateSimulationForm);
        const saved = await this.simulationService.persist(updated);

        return SimulationDTOFactory.fromEntity(saved);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a simulation' })
    @ApiResponse({ status: 200, description: 'Deleted simulation' })
    @ApiResponse({ status: 404, description: 'Simulation not found' })
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
    public async workers(
        @Param('id', ParseUUIDPipe) simulationId: string,
        @Paging('Worker', PagingValidationPipe) paging: PagingParams<Worker>,
    ): Promise<WorkerListResponse> {
        const simulation = await this.simulationService.findOneByUid(simulationId);
        paging.filter = { ...paging.filter, _simulation: simulation.id } as any; // TODO: this needs fixing
        const [workers, count] = await this.workerService.findManyPaged(paging);

        // TODO: check hateaos links on this endpoint
        return WorkerDTOFactory.fromCollection(workers, count, paging);
    }
}
