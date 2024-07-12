import { Injectable, Logger } from '@nestjs/common';

import { Entry } from '@domain/entities';
import { ScenarioWorkerService } from './scenario-worker.service';

export interface ScenarioCosts {
    sumOfRemunerationIncrease: number;
    sumOfTaxes: number;
}

export interface ScenarioReport {
    remunerationIncrease: number;
    taxCosts: number;
    overheadCosts: number;
    totalCosts: number;
    totalCostsPerUnit: number;
}

/**
 * NOTE: this whole service (report calculating) needs to move to scenario.service.ts
 * There seems to be a circular import / dependency problem when adding ScenarioWorkerService
 * to its constructor. TODO: move
 */

@Injectable()
export class ReportService {
    private readonly logger = new Logger(ReportService.name);
    private readonly batchSize = 100;

    constructor(
        private readonly scenarioWorkerService: ScenarioWorkerService,
    ) {}

    public async calculateReport(entry: Entry): Promise<ScenarioReport> {
        if (!entry.canCalculateReport()) {
            this.logger.warn('Tried to calculate report, status is invalid');
            return;
        }

        const { sumOfRemunerationIncrease, sumOfTaxes } = await this.calculateScenarioCosts(entry);
        const totalCosts = sumOfRemunerationIncrease + sumOfTaxes + entry.scenario.specs.overheadCosts;

        const report: ScenarioReport = {
            remunerationIncrease: sumOfRemunerationIncrease,
            taxCosts: sumOfTaxes,
            overheadCosts: entry.scenario.specs.overheadCosts,
            totalCosts: totalCosts,
            totalCostsPerUnit: totalCosts / entry.facility.productionAmount,
        };

        entry.scenario.updateReport(report);

        return report;
    }

    private async calculateScenarioCosts(entry: Entry): Promise<ScenarioCosts> {
        let sumOfRemunerationIncrease = 0;
        let sumOfTaxes = 0;

        for await (const batch of this.scenarioWorkerService.getBatched(
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */
            { _scenario: entry.scenario } as any,
            this.batchSize,
        )) {
            this.logger.debug(`Processing batch of ${batch.length} workers...`);

            for (const worker of batch) {
                this.logger.debug(`Processing worker ${worker.id} (${worker.original.name})`);

                sumOfRemunerationIncrease += worker.getRemunerationIncrease({ forCategory: true });
                sumOfTaxes += worker.getTaxes({ forCategory: true });
            }
        }

        return { sumOfRemunerationIncrease, sumOfTaxes };
    }
}
