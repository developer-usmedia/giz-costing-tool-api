import { HttpException, HttpStatus } from '@nestjs/common';
import { Row } from 'exceljs';

import {
    COLUMN_MAPPING_PAYROLL,
    INFO_SHEET_COLUMN,
    INFO_SHEET_MAPPING,
    SHEET_MAPPING,
} from '@domain/enums/import-column-mapping.enum';
import { EntityValidationError } from '@domain/errors/entity-validation.error';

export enum CellValidationError {
    TODO = 'TODO',
    MISSING_INFO_SHEET = 'MISSING_INFO_SHEET',
    MISSING_PAYROLL_SHEET = 'MISSING_PAYROLL_SHEET',
    VERSION_MISMATCH = 'VERSION_MISMATCH',
}

export interface ImportValidationErrorDto {
    sheetIndex?: number;
    rowIndex?: number;
    column?: string;
    property?: string;
    message?: string;
    value?: string;
    errorType: CellValidationError;
}

export class EntryImportException extends HttpException {
    public readonly errors: ImportValidationErrorDto[];

    constructor(errors: ImportValidationErrorDto[]) {
        super({ errors: errors }, HttpStatus.UNPROCESSABLE_ENTITY);
        this.name = this.constructor.name;
    }
}

export class ImportValidationErrorDTOFactory {
    public static fromWorkerValidationErrors(
        error: EntityValidationError,
        sheetIndex: number,
        row: Row,
    ): ImportValidationErrorDto[] {
        const errors: ImportValidationErrorDto[] = [];

        for (const workerError of error.validationErrors) {
            errors.push({
                sheetIndex: sheetIndex,
                rowIndex: row.number,
                column: COLUMN_MAPPING_PAYROLL[workerError.path] ?? null,
                property: workerError.path,
                message: workerError.message,
                value: workerError.value ?? null,
                errorType: CellValidationError.TODO,
            });
        }

        return errors;
    }

    public static fromInformationSheetError(error: EntityValidationError): ImportValidationErrorDto[] {
        const errors: ImportValidationErrorDto[] = [];

        for (const infoError of error.validationErrors) {
            errors.push({
                sheetIndex: SHEET_MAPPING.info,
                rowIndex: INFO_SHEET_MAPPING[infoError.path] ?? null,
                column: INFO_SHEET_COLUMN,
                property: infoError.path,
                message: infoError.message,
                value: infoError.value ?? null,
                errorType: CellValidationError.TODO, // TODO: update with other error types
            });
        }

        return errors;
    }
}
