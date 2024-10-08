import { Workbook } from 'exceljs';

import { CellValidationError, ImportValidationErrorDto } from '@import/dto/import-validation.dto';
import { INFO_SHEET_MAPPING, SHEET_MAPPING } from '@import/dto/import-column-mapping.enum';

export class WorkbookValidator {
    public errors: ImportValidationErrorDto[] = [];

    private readonly ACCEPTED_VERSION = '2.3.0';
    private readonly workbook: Workbook;

    constructor(workbook: Workbook) {
        this.workbook = workbook;
    }

    public validateSheetStructure(): ImportValidationErrorDto[] {
        if (!this.workbook) {
            throw new Error('Workbook not loaded');
        }

        this.validateInfoSheet();
        this.validatePayrollSheet();

        return this.errors;
    }

    private validateInfoSheet(): ImportValidationErrorDto[] {
        const infoSheet = this.workbook.getWorksheet(SHEET_MAPPING.info);

        if (!infoSheet) {
            this.errors.push({
                sheetIndex: SHEET_MAPPING.info,
                errorType: CellValidationError.MISSING_INFO_SHEET,
            });

            return this.errors;
        }

        const templateVersion = infoSheet.getCell(INFO_SHEET_MAPPING.templateVersion);
        if (templateVersion.text !== this.ACCEPTED_VERSION) {
            this.errors.push({
                sheetIndex: SHEET_MAPPING.info,
                rowIndex: Number(templateVersion.row),
                column: templateVersion.col,
                property: 'templateVersion',
                errorType: CellValidationError.VERSION_MISMATCH,
                message: `Template version ${templateVersion.text} does not match supported version: ${this.ACCEPTED_VERSION}`,
            });

            return this.errors;
        }

        return this.errors;
    }

    private validatePayrollSheet(): ImportValidationErrorDto[] {
        const payrollSheet = this.workbook.getWorksheet(SHEET_MAPPING.payroll);

        if (!payrollSheet) {
            this.errors.push({
                sheetIndex: SHEET_MAPPING.payroll,
                errorType: CellValidationError.MISSING_PAYROLL_SHEET,
            });

            return this.errors;
        }

        return this.errors;
    }
}
