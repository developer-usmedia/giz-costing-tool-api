import { Injectable, Logger } from '@nestjs/common';

import { Scenario } from '@domain/entities';
import { ScenarioWorkerService } from './scenario-worker.service';
import { ScenarioService } from './scenario.service';

@Injectable()
export class ScenarioLivingWageCalculationsService {
    private readonly logger = new Logger(ScenarioLivingWageCalculationsService.name);

    constructor(
        private readonly scenarioService: ScenarioService,
        private readonly workerService: ScenarioWorkerService
    ) {}

    async calculateLwGaps(scenario: Scenario): Promise<Scenario> {
        let nrOfJobCategories = 0;
        let workersBelowLw = 0;
        let largestGap = 0;
        let sumOfAnnualLwGapAllWorkers = 0;
        let sumOfMonthlyLwGap = 0;

        for await (const batch of this.workerService.getBatched(
            /* eslint-disable @typescript-eslint/no-unsafe-argument */
            { _scenario: scenario.id } as any,
            100,
        )) {
            this.logger.debug(`Processing batch of ${batch.length} workers...`);
            for (const worker of batch) {
                this.logger.debug(`Processing worker ${worker.id} (${worker.original.name})`);
                nrOfJobCategories++;

                const gap = worker.livingWage().livingWageGap;
                if (gap > 0) workersBelowLw += worker.original.nrOfWorkers;

                if (gap > largestGap) {
                    largestGap = gap;
                }

                sumOfAnnualLwGapAllWorkers += worker.livingWage().annualLivingWageGapAllWorkers;
                sumOfMonthlyLwGap += worker.livingWage().livingWageGap;
            }
        }

        let avgGap = sumOfMonthlyLwGap / nrOfJobCategories;
        avgGap = isNaN(avgGap) ? 0 : avgGap; // Catch 0 / 0 => NaN

        scenario.updatePayroll({
            avgLivingWageGap: avgGap,
            largestLivingWageGap: largestGap,
            sumAnnualLivingWageGapAllWorkers: sumOfAnnualLwGapAllWorkers,
            nrOfWorkersWithLWGap: workersBelowLw,
        });

        return await this.scenarioService.persist(scenario);
    }
}