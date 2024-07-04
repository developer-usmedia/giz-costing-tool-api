import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Row, Workbook } from 'exceljs';

const DEFAULT_CHUNK_SIZE = 50;

export class FileHelper {
    static async readChunked(
        fileBuffer: Buffer,
        callback: (chunk: Row[]) => void,
        meta: {
            sheetIndex: number;
            chunkSize: number;
            startRow: number;
        },
    ): Promise<void> {
        const sheetIndex = meta.sheetIndex ?? 1;
        const chunkSize = meta.chunkSize ?? DEFAULT_CHUNK_SIZE;
        let startRow = meta.startRow ?? 1;

        const workbook = new Workbook();
        await workbook.xlsx.load(fileBuffer);
        const worksheet = workbook.getWorksheet(sheetIndex);

        while (startRow <= worksheet.rowCount) {
            const endRow = Math.min(startRow + chunkSize - 1, worksheet.rowCount);
            const chunk: Row[] = [];

            for (let i = startRow; i <= endRow; i++) {
                chunk.push(worksheet.getRow(i));
            }

            callback(chunk);
            startRow += chunkSize;
        }
    }

    static createFileInterceptor(mimeType: string, fileSizeLimit: number, key = 'file') {
        return FileInterceptor(key, {
            limits: { fileSize: fileSizeLimit },
            fileFilter: (_req, file, callback) => FileHelper.fileFilter(file, callback, mimeType),
        });
    }

    static fileFilter(
        file: Record<string, any>,
        callback: (error: Error, acceptFile: boolean) => void,
        mimeType: string,
    ) {
        if (file.mimetype !== mimeType) {
            return callback(
                new BadRequestException(`Invlaid file type. Only mimeType ${mimeType} files are accepted`),
                false,
            );
        }
        callback(null, true);
    }
}
