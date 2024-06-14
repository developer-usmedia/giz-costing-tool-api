import { Logger } from '@nestjs/common';
import { Row, Workbook } from 'exceljs';

import { Entry } from '@domain/entities/entry.entity';
import { User } from '@domain/entities/user.entity';
import { Worker } from '@domain/entities/worker.entity';
import {
    COLUMN_MAPPING_PAYROLL,
    INFO_SHEET_MAPPING,
    SHEET_MAPPING,
    SHEET_PAYROLL_INDEX,
    SHEET_PAYROLL_START_ROW,
} from '@domain/enums/import-column-mapping.enum';
import { EntityValidationError } from '@domain/errors/entity-validation.error';
import { EntryFactory } from '@domain/factories/entry.factory';
import { WorkerFactory } from '@domain/factories/worker.factory';
import { EntryInfo } from '@domain/schemas/entry-info.schema';
import { WorkerData } from '@domain/schemas/worker.schema';
import { FileHelper } from '@domain/utils/file-helper';
import { ImportValidationErrorDTOFactory, ImportValidationErrorDto } from './dto/import-validation.dto';
import { parseFloatCell, parseGenderCell, parseIntCell } from './workbook-parse-helpers';
import { WorkbookValidator } from './workbook-validator';

const TWO_MB = 2 * 1024 * 1024; // WordPress
// const TEN_MB = 10 * 1024 * 1024; // Trello
// const TWENTY_FIVE_MB = 25 * 1024 * 1024; // Gmail

export class EntryImporter {
    public static readonly ACCEPTED_FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // .xlsx
    public static readonly FILE_SIZE_LIMIT = TWO_MB;
    public entry: Entry;
    public errors: ImportValidationErrorDto[] = [];

    private readonly logger = new Logger(EntryImporter.name);
    private readonly CHUNK_SIZE = 100;
    private readonly N_OF_ERRORS_BREAKPOINT = 25;
    // TODO: Storing the full file buffer in the fileBuffer attribute still stores the whole file. Refactor
    private readonly fileName: string;
    private readonly fileBuffer: Buffer;
    private readonly user: User;
    private workbook: Workbook;
    private workbookValidator: WorkbookValidator;

    private benchmarkValue: number;

    constructor(fileName: string, fileBuffer: Buffer, user: User) {
        this.fileName = fileName;
        this.fileBuffer = fileBuffer;
        this.user = user;
    }

    public async doImport(): Promise<Entry> {
        this.logger.debug(`Starting EntryImporter for file ${this.fileName}`);

        // All errors will be pushed to this.errors
        this.entry = this.createEntry();

        if (this.errors.length > 0) {
            return;
        }

        await this.processRows();

        // Temp way to get benchmark value from sheet.
        // Sheet has value set for each worker instead of on the information sheet. A change to the excel is required
        this.entry.benchmark.localValue = this.benchmarkValue;

        // This is also missing form the excel sheet
        this.entry.benchmark.region = this.entry.facility.countryCode;

        return this.entry;
    }

    public async loadWorkbook(): Promise<Workbook> {
        const workbook = new Workbook();
        await workbook.xlsx.load(this.fileBuffer);

        this.workbook = workbook;
        this.workbookValidator = new WorkbookValidator(this.workbook);

        return workbook;
    }

    public async validateSheetStructure(): Promise<ImportValidationErrorDto[]> {
        if (!this.workbookValidator) {
            await this.loadWorkbook();
        }

        const errors = this.workbookValidator.validateSheetStructure();
        this.errors.push(...errors);

        return errors;
    }

    public async processRows(): Promise<void> {
        this.logger.debug(`Processing rows for file ${this.fileName}`);

        await this.readChunked((chunk) => {
            this.logger.verbose(`process() - Reading new chunk (n: ${chunk.length})`);

            for (const row of chunk) {
                this.logger.verbose(`process() - Reading row: ${row.number}`);

                if (this.errors?.length > this.N_OF_ERRORS_BREAKPOINT) {
                    return;
                }

                
                if(!this.benchmarkValue) {
                    this.benchmarkValue = parseFloatCell(row.getCell(COLUMN_MAPPING_PAYROLL.benchmarkValue).text);
                }

                const worker = this.createWorker(row);

                if (worker) {
                    this.entry.addWorker(worker);
                }
            }
        });
    }

    private createWorker(row: Row): Worker {
        try {
            const workerData = this.convertRowToWorkerDto(row);

            return WorkerFactory.createEntity(workerData, this.entry);
        } catch (error: any) {
            if (error instanceof EntityValidationError) {
                const errors = ImportValidationErrorDTOFactory.fromWorkerValidationErrors(
                    error as EntityValidationError<Worker>,
                    SHEET_MAPPING.payroll,
                    row,
                );

                this.errors.push(...errors);
            } else {
                this.logger.debug('Entity creation error while creating worker from import');
                this.logger.error(error);
                return;
            }

            return null;
        }
    }

    private createEntry(): Entry {
        const entryInfo = this.parseEntryInfo();

        try {
            const entry = EntryFactory.createEntity(entryInfo, this.user);
            this.entry = entry;

            return entry;
        } catch (error: any) {
            if (error instanceof EntityValidationError) {
                const errors = ImportValidationErrorDTOFactory.fromInformationSheetError(
                    error as EntityValidationError<Entry>,
                );
                this.errors.push(...errors);
            } else {
                this.logger.debug('Entity creation error while creating entry from import');
                this.logger.error(error);
                throw error;
            }

            return null;
        }
    }

    private async readChunked(callback: (chunk: Row[]) => void): Promise<void> {
        return FileHelper.readChunked(this.fileBuffer, callback, {
            sheetIndex: SHEET_PAYROLL_INDEX,
            chunkSize: this.CHUNK_SIZE,
            startRow: SHEET_PAYROLL_START_ROW,
        });
    }
    private parseEntryInfo(): EntryInfo {
        const infoSheet = this.workbook.getWorksheet(SHEET_MAPPING.info);

        // TODO: Both null values need to be added to the info sheet of idh excel import
        return {
            matrixId: null,
            facilityName: infoSheet.getCell(INFO_SHEET_MAPPING.facilityName).text,
            facilityId: infoSheet.getCell(INFO_SHEET_MAPPING.facilityId).text,
            benchmarkName: infoSheet.getCell(INFO_SHEET_MAPPING.benchmarkName).text,
            countryCode: null,
            country: infoSheet.getCell(INFO_SHEET_MAPPING.country).text,
            region: infoSheet.getCell(INFO_SHEET_MAPPING.region).text,
            annualProduction: parseIntCell(infoSheet.getCell(INFO_SHEET_MAPPING.annualProduction).text),
            unitOfProduction: infoSheet.getCell(INFO_SHEET_MAPPING.unitOfProduction).text,
            productName: infoSheet.getCell(INFO_SHEET_MAPPING.productName).text,
            year: parseIntCell(infoSheet.getCell(INFO_SHEET_MAPPING.year).text),
            currencyCode: infoSheet.getCell(INFO_SHEET_MAPPING.currencyCode).text,
        };
    }

    private readonly convertRowToWorkerDto = (row: Row): WorkerData => {
        return {
            name: row.getCell(COLUMN_MAPPING_PAYROLL.name).text,
            gender: parseGenderCell(row.getCell(COLUMN_MAPPING_PAYROLL.gender).text),
            numberOfWorkers: parseIntCell(row.getCell(COLUMN_MAPPING_PAYROLL.numberOfWorkers).text),
            monthlyWage: parseFloatCell(row.getCell(COLUMN_MAPPING_PAYROLL.monthlyWage).text),
            percentageOfYearsWorked: parseFloatCell(row.getCell(COLUMN_MAPPING_PAYROLL.percentageOfYearsWorked).text),
            ikbFood: parseFloatCell(row.getCell(COLUMN_MAPPING_PAYROLL.ikbFood).text),
            ikbTransportation: parseFloatCell(row.getCell(COLUMN_MAPPING_PAYROLL.ikbTransportation).text),
            ikbHousing: parseFloatCell(row.getCell(COLUMN_MAPPING_PAYROLL.ikbHousing).text),
            ikbHealthcare: parseFloatCell(row.getCell(COLUMN_MAPPING_PAYROLL.ikbHealthcare).text),
            ikbChildcare: parseFloatCell(row.getCell(COLUMN_MAPPING_PAYROLL.ikbChildCare).text),
            employeeTax: 0,
            employerTax: 0,
        };
    };
}