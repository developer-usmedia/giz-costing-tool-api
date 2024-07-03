import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class ScenarioPayroll {
    @Property({ columnType: 'integer', unsigned: true, nullable: true, fieldName: 'num_workers_lwgap' })
    private readonly _nrOfWorkersWithLWGap: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true, nullable: true, fieldName: 'avg_lwgap' })
    private readonly _avgLivingWageGap: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true, nullable: true, fieldName: 'largest_lwgap' })
    private readonly _largestLivingWageGap: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true, nullable: true, fieldName: 'sum_lwgap_allworkers' })
    private readonly _sumAnnualLivingWageGapAllWorkers: number;

    // TODO: Sums Annual Costs ?

    constructor() {
        // Note: Fields are set via a custom query (triggered via the service)
    }

    get nrOfWorkersWithLWGap() {
        return this._nrOfWorkersWithLWGap ?? 0;
    }

    get avgLivingWageGap() {
        return this._avgLivingWageGap ?? 0;
    }

    get largestLivingWageGap() {
        return this._largestLivingWageGap ?? 0;
    }

    get sumAnnualLivingWageGapAllWorkers() {
        return this._sumAnnualLivingWageGapAllWorkers ?? 0;
    }
}
