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
import { EntryCreateForm } from '@api/dto/entry-create.form';
import { EntryUpdateForm } from '@api/dto/entry-update.form';
import { EntryDTOFactory, EntryListResponse, EntryResponse } from '@api/dto/entry.dto';
import { WorkerDTOFactory, WorkerListResponse } from '@api/dto/worker.dto';
import { CurrentUser } from '@api/nestjs/decorators/user.decorator';
import { PagingParams, Sort } from '@api/paging/paging-params';
import { PagingValidationPipe } from '@api/paging/paging-params.pipe';
import { Paging } from '@api/paging/paging.decorator';
import { Entry } from '@domain/entities/entry.entity';
import { User } from '@domain/entities/user.entity';
import { Worker } from '@domain/entities/worker.entity';
import { EntryService } from '@domain/services/entry.service';
import { EntryImportException } from '@domain/services/import/dto/import-validation.dto';
import { EntryImporter } from '@domain/services/import/entry-importer';
import { UserService } from '@domain/services/user.service';
import { WorkerService } from '@domain/services/worker.service';
import { FileHelper } from '@domain/utils/file-helper';

@ApiTags('entries')
@Controller('entries')
export class EntryController extends BaseController {
    constructor(
        private readonly userService: UserService,
        private readonly entryService: EntryService,
        private readonly workerService: WorkerService,
    ) {
        super();
    }

    @Get('/')
    @ApiOperation({ summary: 'Get a paginated list of entries' })
    @ApiResponse({ status: 200, description: 'Paged entries for the current user' })
    @UseGuards(JwtAuthGuard)
    public async index(
        @Paging('Entry', PagingValidationPipe) paging: PagingParams<Entry>,
    ): Promise<EntryListResponse> {
        paging.sort = { _updatedAt: Sort.DESC };
        const [entries, count] = await this.entryService.findManyPaged(paging);

        return EntryDTOFactory.fromCollection(entries, count, paging);
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

    @Post('/')
    @ApiOperation({ summary: 'Create a entry' })
    @ApiResponse({ status: 201, description: 'Created entr' })
    @ApiResponse({ status: 404, description: 'User from token not found' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    public async create(@Body() entryForm: EntryCreateForm, @CurrentUser() user: User): Promise<EntryResponse> {
        const newEntry = EntryCreateForm.toEntity(entryForm, user);
        const savedEntry = await this.entryService.persist(newEntry);

        return EntryDTOFactory.fromEntity(savedEntry);
    }

    @Post('/import')
    @ApiOperation({ summary: 'Import a entry via SM Excel export' })
    @ApiResponse({ status: 201, description: 'Imported entry' })
    @ApiResponse({ status: 422, description: 'Errors found while importing' })
    @UseInterceptors(
        FileHelper.createFileInterceptor(EntryImporter.ACCEPTED_FILE_TYPE, EntryImporter.FILE_SIZE_LIMIT),
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

    @Patch('/:id')
    @ApiOperation({ summary: 'Update a entry' })
    @ApiResponse({ status: 201, description: 'Updated entry' })
    @ApiResponse({ status: 404, description: 'Entry to update not found' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
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
    @UsePipes(ValidationPipe)
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
        @Paging('Worker', PagingValidationPipe) paging: PagingParams<Worker>,
    ): Promise<WorkerListResponse> {
        const entry = await this.entryService.findOneByUid(entryId);
        paging.filter = { ...paging.filter, _entry: entry.id } as any; // TODO: this needs fixing
        const [workers, count] = await this.workerService.findManyPaged(paging);

        // TODO: check hateaos links on this endpoint
        return WorkerDTOFactory.fromCollection(workers, count, paging);
    }
}
