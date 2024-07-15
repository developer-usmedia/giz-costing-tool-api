import { Injectable, Logger } from '@nestjs/common';
import { Workbook } from 'exceljs';

import { Entry } from '@domain/entities';
import { ScenarioWorkerService } from '../../domain/services/scenario-worker.service';
import { EntryExporter } from './entry-exporter';

@Injectable()
export class EntryExportService {
    private readonly logger = new Logger(EntryExportService.name);
    private readonly batchSize = 100;

    constructor(private readonly scenarioWorkerService: ScenarioWorkerService) {}

    public async export(entry: Entry): Promise<Workbook> {
        this.logger.log(`Starting export for entry ${entry.id}`);
        const exporter = new EntryExporter(entry);

        for await (const batch of this.scenarioWorkerService.getBatched(
            /* eslint-disable @typescript-eslint/no-unsafe-argument */
            { _scenario: entry.scenario } as any,
            this.batchSize,
        )) {
            this.logger.debug(`Adding new batch ${batch.length} to payrollSheet`);
            exporter.addWorkersToPayrollSheet(batch);
        }

        return exporter.workbook;
    }
}
