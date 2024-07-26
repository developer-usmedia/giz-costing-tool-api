import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Res,
    UnprocessableEntityException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { JwtAuthGuard } from '@api/auth';
import { BaseController } from '@api/controllers';
import { CurrentUser, Paging } from '@api/decorators';
import { EntryDTOFactory, EntryListResponse, EntryResponse } from '@api/dto';
import { EntryCreateForm, EntryUpdateForm } from '@api/forms';
import { PagingParams, Sort } from '@api/paging/paging-params';
import { PagingValidationPipe } from '@api/paging/paging-params.pipe';
import { Entry, User } from '@domain/entities';
import { EntryService, ReportService, UserService } from '@domain/services';
import { EntryImportException } from '@import/dto/import-validation.dto';
import { EntryImporter } from '@import/services/entry-importer';
import { FileHelper } from '@import/utils/file-helper';
import { EntryExportService } from 'src/export/services/entry-export.service';

@ApiTags('entries')
@Controller('entries')
@UseGuards(JwtAuthGuard)
export class EntryController extends BaseController {
    constructor(
        private readonly userService: UserService,
        private readonly entryService: EntryService,
        private readonly reportService: ReportService,
        private readonly exportService: EntryExportService,
    ) {
        super();
    }

    @Get('/')
    @ApiOperation({ summary: 'Get a paginated list of entries' })
    @ApiResponse({ status: 200, description: 'Paged entries for the current user' })
    public async findMany(
        @Paging('Entry', PagingValidationPipe) paging: PagingParams<Entry>,
    ): Promise<EntryListResponse> {
        if (!paging.sort) {
            paging.sort = { _updatedAt: Sort.DESC };
        }

        const [entries, count] = await this.entryService.findManyPaged(paging);

        return EntryDTOFactory.fromCollection(entries, count, paging);
    }

    @Post('/')
    @ApiOperation({ summary: 'Create a entry' })
    @ApiResponse({ status: 201, description: 'Created entry' })
    @ApiResponse({ status: 404, description: 'User from token not found' })
    public async create(
        @Body() entryForm: EntryCreateForm,
        @CurrentUser() user: User,
    ): Promise<EntryResponse> {
        const newEntry = EntryCreateForm.toEntity(entryForm, user);
        const savedEntry = await this.entryService.persist(newEntry);

        return EntryDTOFactory.fromEntity(savedEntry);
    }

    @Get('/:entryId')
    @ApiOperation({ summary: 'Get a single entry by id' })
    @ApiResponse({ status: 404, description: 'The entry cannot be found' })
    @ApiResponse({ status: 200, description: 'The entry record' })
    public async findOne(
        @Param('entryId', ParseUUIDPipe) entryId: string,
    ): Promise<EntryResponse> {
        const entry = await this.entryService.findOneByUid(entryId);

        return EntryDTOFactory.fromEntity(entry);
    }

    @Patch('/:entryId')
    @ApiOperation({ summary: 'Update a entry' })
    @ApiResponse({ status: 201, description: 'Updated entry' })
    @ApiResponse({ status: 404, description: 'Entry to update not found' })
    public async update(
        @Param('entryId', ParseUUIDPipe) entryId: string,
        @Body() updateEntryForm: EntryUpdateForm,
    ): Promise<EntryResponse> {
        const original = await this.entryService.findOneByUid(entryId);
        const updated = EntryUpdateForm.toEntity(original, updateEntryForm);

        if (
            updateEntryForm.buyer.buyerProportion ||
            updateEntryForm.buyer.buyerUnit ||
            updateEntryForm.overheadCosts ||
            updateEntryForm.taxEmployee ||
            updateEntryForm.taxEmployer
        ) {
            await this.reportService.calculateReport(updated);
        }

        const saved = await this.entryService.persist(updated);

        return EntryDTOFactory.fromEntity(saved);
    }

    @Delete('/:entryId')
    @ApiOperation({ summary: 'Delete a entry' })
    @ApiResponse({ status: 200, description: 'Deleted entry' })
    @ApiResponse({ status: 404, description: 'Entry not found' })
    public async delete(
        @Param('entryId', ParseUUIDPipe) entryId: string,
    ): Promise<EntryResponse> {
        const entry = await this.entryService.findOneByUid(entryId);
        const deleted = await this.entryService.remove(entry);

        return EntryDTOFactory.fromEntity(deleted);
    }

    @Post('/import')
    @ApiOperation({ summary: 'Import an entry via SM Excel export' })
    @ApiResponse({ status: 201, description: 'Imported entry' })
    @ApiResponse({ status: 422, description: 'Errors found while importing' })
    @UseInterceptors(FileHelper.createFileInterceptor(EntryImporter.ACCEPTED_FILE_TYPE, EntryImporter.FILE_SIZE_LIMIT))
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

    @Get('/:entryId/export')
    @ApiOperation({ summary: 'Export an entry' })
    @ApiResponse({ status: 201, description: 'Excel export of entry scenario' })
    public async export(
        @Param('entryId', ParseUUIDPipe) entryId: string,
        @Res() res: Response,
    ): Promise<any> {
        const entry = await this.entryService.findOneByUid(entryId);

        if (entry.status !== 'COMPLETED') {
            this.clientError('Cannot export entry with an incomplete status');
        }

        const fileName = `${entry.facility.name}-${entry.payroll.year}-LWCostingToolResults.xlsx`.replace(/ /g,'_');
        res.contentType('.xlsx');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.status(200);

        const workbook = await this.exportService.export(entry);
        await workbook.xlsx.write(res);

        return res.send();
    }

}
