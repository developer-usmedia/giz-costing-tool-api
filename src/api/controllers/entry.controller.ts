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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/auth/jwt/jwt.guard';
import { BaseController } from '@api/controllers/base.controller';
import { EntryCreateForm } from '@api/dto/entry-create.form';
import { EntryUpdateForm } from '@api/dto/entry-update.form';
import { EntryWorkerDTOFactory, EntryWorkerListResponse } from '@api/dto/entry-worker.dto';
import { EntryDTOFactory, EntryListResponse, EntryResponse } from '@api/dto/entry.dto';
import { ScenarioCreateForm } from '@api/dto/scenario-create.form';
import { ScenarioUpdateForm } from '@api/dto/scenario-update.form';
import { CurrentUser } from '@api/nestjs/decorators/user.decorator';
import { PagingParams, Sort } from '@api/paging/paging-params';
import { PagingValidationPipe } from '@api/paging/paging-params.pipe';
import { Paging } from '@api/paging/paging.decorator';
import { EntryWorker } from '@domain/entities/entry-worker.entity';
import { Entry } from '@domain/entities/entry.entity';
import { User } from '@domain/entities/user.entity';
import { EntryWorkerService } from '@domain/services/entry-worker.service';
import { EntryService } from '@domain/services/entry.service';
import { EntryImportException } from '@domain/services/import/dto/import-validation.dto';
import { EntryImporter } from '@domain/services/import/entry-importer';
import { ScenarioService } from '@domain/services/scenario.service';
import { UserService } from '@domain/services/user.service';
import { FileHelper } from '@domain/utils/file-helper';

@ApiTags('entries')
@Controller('entries')
export class EntryController extends BaseController {
    constructor(
        private readonly userService: UserService,
        private readonly entryService: EntryService,
        private readonly workerService: EntryWorkerService,
        private readonly scenarioService: ScenarioService,
    ) {
        super();
    }

    @Get('/')
    @ApiOperation({ summary: 'Get a paginated list of entries' })
    @ApiResponse({ status: 200, description: 'Paged entries for the current user' })
    @UseGuards(JwtAuthGuard)
    public async index(@Paging('Entry', PagingValidationPipe) paging: PagingParams<Entry>): Promise<EntryListResponse> {
        if (!paging.sort) {
            paging.sort = { _updatedAt: Sort.DESC };
        }
        const [entries, count] = await this.entryService.findManyPaged(paging);

        return EntryDTOFactory.fromCollection(entries, count, paging);
    }

    @Post('/')
    @ApiOperation({ summary: 'Create a entry' })
    @ApiResponse({ status: 201, description: 'Created entr' })
    @ApiResponse({ status: 404, description: 'User from token not found' })
    @UseGuards(JwtAuthGuard)
    public async create(@Body() entryForm: EntryCreateForm, @CurrentUser() user: User): Promise<EntryResponse> {
        const newEntry = EntryCreateForm.toEntity(entryForm, user);
        const savedEntry = await this.entryService.persist(newEntry);

        return EntryDTOFactory.fromEntity(savedEntry);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a single entry by id' })
    @ApiResponse({ status: 404, description: 'The entry cannot be found' })
    @ApiResponse({ status: 200, description: 'The entry record' })
    @UseGuards(JwtAuthGuard)
    public async findBy(@Param('id', ParseUUIDPipe) id: string): Promise<EntryResponse> {
        const entry = await this.entryService.findOneByUid(id);

        return EntryDTOFactory.fromEntity(entry);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Update a entry' })
    @ApiResponse({ status: 201, description: 'Updated entry' })
    @ApiResponse({ status: 404, description: 'Entry to update not found' })
    @UseGuards(JwtAuthGuard)
    public async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateEntryForm: EntryUpdateForm,
    ): Promise<EntryResponse> {
        const original = await this.entryService.findOneByUid(id);
        const updated = EntryUpdateForm.toEntity(original, updateEntryForm);
        const saved = await this.entryService.persist(updated);

        return EntryDTOFactory.fromEntity(saved);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a entry' })
    @ApiResponse({ status: 200, description: 'Deleted entry' })
    @ApiResponse({ status: 404, description: 'Entry not found' })
    @UseGuards(JwtAuthGuard)
    public async destroy(@Param('id', ParseUUIDPipe) id: string): Promise<EntryResponse> {
        const entry = await this.entryService.findOneByUid(id);
        const deleted = await this.entryService.remove(entry);

        return EntryDTOFactory.fromEntity(deleted);
    }

    @Get('/:id/workers')
    @ApiOperation({ summary: 'Get workers registered on a entry' })
    @ApiResponse({ status: 404, description: 'The entry cannot be found' })
    @ApiResponse({ status: 200, description: 'The list of workers on the entry' })
    @UseGuards(JwtAuthGuard)
    public async workers(
        @Param('id', ParseUUIDPipe) entryId: string,
        @Paging('EntryWorker', PagingValidationPipe) paging: PagingParams<EntryWorker>,
    ): Promise<EntryWorkerListResponse> {
        const entry = await this.entryService.findOneByUid(entryId);
        paging.filter = { ...paging.filter, _entry: entry.id } as any; // TODO: this needs fixing
        const [workers, count] = await this.workerService.findManyPaged(paging);

        // TODO: check hateaos links on this endpoint
        return EntryWorkerDTOFactory.fromCollection(workers, count, paging);
    }

    @Post('/:id/scenario')
    @ApiOperation({ summary: 'Set scenario for entry' })
    @ApiResponse({ status: 404, description: 'Entry not found' })
    @ApiResponse({ status: 400, description: 'Entry already has scenario selected' })
    @ApiResponse({ status: 200, description: 'Succesfully set scenario' })
    @UseGuards(JwtAuthGuard)
    public async selectScenario(
        @Param('id', ParseUUIDPipe) entryId: string,
        @Body() createScenarioForm: ScenarioCreateForm,
    ): Promise<EntryResponse> {
        const entry = await this.entryService.findOneByUid(entryId, { populate: ['_scenario'] as any });

        if (entry.scenario) {
            return this.clientError('Entry already has a scenario selected. Delete the scenario first.');
        }

        const scenario = ScenarioCreateForm.toEntity(createScenarioForm, entry);
        await this.scenarioService.persist(scenario);

        return EntryDTOFactory.fromEntity(entry);
    }

    @Patch('/:id/scenario')
    @ApiOperation({ summary: 'Update a scenario specifications' })
    @ApiResponse({ status: 201, description: 'Updated scenario' })
    @ApiResponse({ status: 404, description: 'Scenario not found' })
    @UseGuards(JwtAuthGuard)
    public async updateScenario(
        @Param('id', ParseUUIDPipe) entryId: string,
        @Body() updateScenarioForm: ScenarioUpdateForm,
    ): Promise<EntryResponse> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const original = await this.scenarioService.findOne({ _entry: entryId } as any);
        const updated = ScenarioUpdateForm.updateEntity(original, updateScenarioForm);
        const saved = await this.scenarioService.persist(updated);

        return EntryDTOFactory.fromEntity(saved.entry);
    }

    @Delete('/:id/scenario')
    @ApiOperation({ summary: 'Delete a scenario from an entry' })
    @ApiResponse({ status: 404, description: 'Scenario not found' })
    @ApiResponse({ status: 200, description: 'Successfully deleted scenario from entry' })
    @UseGuards(JwtAuthGuard)
    public async deleteScenario(@Param('id', ParseUUIDPipe) entryId: string): Promise<EntryResponse> {
        const entry = await this.entryService.findOneByUid(entryId);
        await this.scenarioService.remove(entry.scenario);

        return EntryDTOFactory.fromEntity(entry);
    }

    @Post('/import')
    @ApiOperation({ summary: 'Import a entry via SM Excel export' })
    @ApiResponse({ status: 201, description: 'Imported entry' })
    @ApiResponse({ status: 422, description: 'Errors found while importing' })
    @UseInterceptors(FileHelper.createFileInterceptor(EntryImporter.ACCEPTED_FILE_TYPE, EntryImporter.FILE_SIZE_LIMIT))
    @UseGuards(JwtAuthGuard)
    public async import(@UploadedFile() file: Express.Multer.File, @CurrentUser() sessionUser: User): Promise<any> {
        if (!file) {
            throw new UnprocessableEntityException('No file uploaded');
        }

        const user = await this.userService.findOneByUid(sessionUser.id);
        const importer = new EntryImporter(file.originalname, file.buffer, user);
        await importer.validateSheetStructure();

        if (importer.errors.length > 0) {
            throw new EntryImportException(importer.errors);
        }

        await importer.doImport();

        if (importer.errors.length > 0) {
            throw new EntryImportException(importer.errors);
        }

        const savedEntry = await this.entryService.persist(importer.entry);
        return EntryDTOFactory.fromEntity(savedEntry);
    }
}
