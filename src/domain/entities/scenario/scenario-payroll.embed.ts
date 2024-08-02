import { Embeddable, Property } from '@mikro-orm/core';

export interface ScenarioPayrollProps {
    nrOfWorkersWithLWGap: number;
    avgLivingWageGap: number;
    largestLivingWageGap: number;
    sumAnnualLivingWageGapAllWorkers: number;
}

@Embeddable()
export class ScenarioPayroll {
    @Property({ columnType: 'integer', unsigned: true, fieldName: 'num_workers_lwgap' })
    private readonly _nrOfWorkersWithLWGap: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true, fieldName: 'avg_lwgap' })
    private readonly _avgLivingWageGap: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true, fieldName: 'largest_lwgap' })
    private readonly _largestLivingWageGap: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true, fieldName: 'sum_lwgap_allworkers' })
    private readonly _sumAnnualLivingWageGapAllWorkers: number;

    constructor(props?: ScenarioPayrollProps) {
        if (props) {
            // Note: These fields are updated via a custom query (triggered via the service)
            this._nrOfWorkersWithLWGap = props.nrOfWorkersWithLWGap ?? 0;
            this._avgLivingWageGap = props.avgLivingWageGap ?? 0;
            this._largestLivingWageGap = props.largestLivingWageGap ?? 0;
            this._sumAnnualLivingWageGapAllWorkers = props.sumAnnualLivingWageGapAllWorkers ?? 0;
        }
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
