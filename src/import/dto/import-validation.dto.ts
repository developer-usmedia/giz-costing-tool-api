import { HttpException, HttpStatus } from '@nestjs/common';
import { Row } from 'exceljs';

import { EntityValidationError } from '@import/errors/entity-validation.error';
import { COLUMN_MAPPING_PAYROLL, INFO_SHEET_COLUMN, INFO_SHEET_MAPPING, SHEET_MAPPING } from './import-column-mapping.enum';

// https://github.com/hapijs/joi/blob/master/lib/types/string.js#L704
// https://github.com/hapijs/joi/blob/master/lib/types/number.js#L310
// 'number.base': '{{#label}} must be a number',
// 'number.max': '{{#label}} must be less than or equal to {{#limit}}',
// 'number.min': '{{#label}} must be greater than or equal to {{#limit}}',
// 'string.max': '{{#label}} length must be less than or equal to {{#limit}} characters long',
// 'string.min': '{{#label}} length must be at least {{#limit}} characters long',
// 'string.trim': '{{#label}} must not have leading or trailing whitespace',
export enum CellValidationError {
    NUMBER_BASE = 'number.base',
    NUMBER_MIN = 'number.min',
    NUMBER_MAX = 'number.max',
    STRING_BASE = 'string.base',
    STRING_MIN = 'string.min',
    STRING_MAX = 'string.max',
    STRING_TRIM = 'string.trim',
    REQUIRED = 'any.required',
    MISSING_INFO_SHEET = 'MISSING_INFO_SHEET',
    MISSING_PAYROLL_SHEET = 'MISSING_PAYROLL_SHEET',
    VERSION_MISMATCH = 'VERSION_MISMATCH',
    UNKNOWN = 'unknown',
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
                errorType: workerError.type as CellValidationError,
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
                errorType: infoError.type as CellValidationError,
            });
        }

        return errors;
    }
}
