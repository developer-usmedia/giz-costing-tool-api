import { Injectable, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';

import { Entry } from '@domain/entities';
import { ScenarioLivingWageCalculationsService } from '@domain/services/scenario-living-wage-calculations.service';
import { ScenarioWorkerService } from './scenario-worker.service';

export interface ScenarioCosts {
    sumOfRemunerationIncrease: Decimal;
    sumOfTaxes: Decimal;
}

export interface ScenarioReport {
    remunerationIncrease: Decimal;
    taxCosts: Decimal;
    overheadCosts: number;
    totalCosts: Decimal;
    totalCostsPerUnit: Decimal;
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
        private readonly lwCalculationService: ScenarioLivingWageCalculationsService,
    ) {}

    public async calculateReport(entry: Entry): Promise<ScenarioReport> {
        if (!entry.canCalculateReport()) {
            this.logger.warn('Tried to calculate report, status is invalid');
            return;
        }

        const { sumOfRemunerationIncrease, sumOfTaxes } = await this.calculateScenarioCosts(entry);
        const totalCosts = sumOfRemunerationIncrease
            .plus(sumOfTaxes)
            .plus(entry.scenario.specs.overheadCosts);

        const report: ScenarioReport = {
            remunerationIncrease: sumOfRemunerationIncrease,
            taxCosts: sumOfTaxes,
            overheadCosts: entry.scenario.specs.overheadCosts,
            totalCosts: totalCosts,
            totalCostsPerUnit: totalCosts.dividedBy(entry.facility.productionAmount),
        };

        entry.scenario.updateReport(report);

        await this.lwCalculationService.calculateLwGaps(entry.scenario);

        return report;
    }

    private async calculateScenarioCosts(entry: Entry): Promise<ScenarioCosts> {
        let sumOfRemunerationIncrease = new Decimal(0);
        let sumOfTaxes = new Decimal(0);

        for await (const batch of this.scenarioWorkerService.getBatched(
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */
            { _scenario: entry.scenario } as any,
            this.batchSize,
        )) {
            this.logger.debug(`Processing batch of ${batch.length} workers...`);

            for (const worker of batch) {
                this.logger.debug(`Processing worker ${worker.id} (${worker.original.name})`);

                const monthlyIncrease = worker.getRemunerationIncrease({ forCategory: true });
                const yearlyIncrease = monthlyIncrease.times(12);
                const percOfYearWorkedMultiplier = new Decimal(worker.original.percOfYearWorked).dividedBy(100);

                sumOfRemunerationIncrease = sumOfRemunerationIncrease.plus(yearlyIncrease.times(percOfYearWorkedMultiplier));
                sumOfTaxes = sumOfTaxes.plus(worker.getTaxes({ forCategory: true }));
            }
        }

        return { sumOfRemunerationIncrease, sumOfTaxes };
    }
}
