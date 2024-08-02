import { Injectable, Logger } from '@nestjs/common';

import { Entry } from '@domain/entities';
import { EntryWorkerService } from './entry-worker.service';
import { EntryService } from './entry.service';

@Injectable()
export class EntryLivingWageCalculationsService {
    private readonly logger = new Logger(EntryLivingWageCalculationsService.name);

    constructor(
        private readonly entryService: EntryService,
        private readonly workerService: EntryWorkerService
    ) {}

    async calculateLwGaps(entry: Entry): Promise<Entry> {
        let nrOfJobCategories = 0;
        let workersBelowLw = 0;
        let largestGap = 0;
        let sumOfAnnualLwGapAllWorkers = 0;
        let sumOfMonthlyLwGap = 0;

        for await (const batch of this.workerService.getBatched(
            /* eslint-disable @typescript-eslint/no-unsafe-argument */
            { _entry: entry.id } as any,
            100,
        )) {
            this.logger.debug(`Processing batch of ${batch.length} workers...`);
            for (const worker of batch) {
                this.logger.debug(`Processing worker ${worker.id} (${worker.name})`);
                nrOfJobCategories++;

                const gap = worker.livingWage().livingWageGap;
                if (gap > 0) workersBelowLw += worker.nrOfWorkers;

                if (gap > largestGap) {
                    largestGap = gap;
                }

                sumOfAnnualLwGapAllWorkers += worker.livingWage().annualLivingWageGapAllWorkers;
                sumOfMonthlyLwGap += worker.livingWage().livingWageGap;
            }
        }

        let avgGap = sumOfMonthlyLwGap / nrOfJobCategories;
        avgGap = isNaN(avgGap) ? 0 : avgGap; // Catch 0 / 0 => NaN

        entry.updatePayrollInfo({
            avgLivingWageGap: avgGap,
            largestLivingWageGap: largestGap,
            sumAnnualLivingWageGapAllWorkers: sumOfAnnualLwGapAllWorkers,
            nrOfWorkersWithLWGap: workersBelowLw,
            year: entry.payroll.year,
            currencyCode: entry.payroll.currencyCode,
        }, true);

        return await this.entryService.persist(entry);
    }
}
