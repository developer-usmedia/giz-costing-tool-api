import { Injectable, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';

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
        let nrOfJobCategories = 0
        let workersBelowLw = 0;
        let largestGap = new Decimal(0);
        let sumOfAnnualLwGapAllWorkers = new Decimal(0);
        let sumOfMonthlyLwGap =  new Decimal(0);

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
                if (gap.greaterThan(0)) workersBelowLw += worker.nrOfWorkers;

                if (gap.greaterThan(largestGap)) {
                    largestGap = gap;
                }

                sumOfAnnualLwGapAllWorkers = sumOfAnnualLwGapAllWorkers.plus(worker.livingWage().annualLivingWageGapAllWorkers)
                sumOfMonthlyLwGap = sumOfMonthlyLwGap.plus(worker.livingWage().livingWageGap)
            }
        }

        let avgGap = sumOfMonthlyLwGap.dividedBy(nrOfJobCategories)
        avgGap = avgGap.isNaN() ? new Decimal(0) : avgGap; // Catch 0 / 0 => NaN

        console.log({
            avgGap,
            largestGap,
            sumOfAnnualLwGapAllWorkers,
        })

        console.log({
            avgLivingWageGap: avgGap.toNumber(),
            largestLivingWageGap: largestGap.toNumber(),
            sumAnnualLivingWageGapAllWorkers: sumOfAnnualLwGapAllWorkers.toNumber(),
            nrOfWorkersWithLWGap: workersBelowLw,
            year: entry.payroll.year,
            currencyCode: entry.payroll.currencyCode,
        })

        entry.updatePayrollInfo({
            avgLivingWageGap: avgGap.toNumber(),
            largestLivingWageGap: largestGap.toNumber(),
            sumAnnualLivingWageGapAllWorkers: sumOfAnnualLwGapAllWorkers. toNumber(),
            nrOfWorkersWithLWGap: workersBelowLw,
            year: entry.payroll.year,
            currencyCode: entry.payroll.currencyCode,
        }, true);

        return await this.entryService.persist(entry);
    }
}
