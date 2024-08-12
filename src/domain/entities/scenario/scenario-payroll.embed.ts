import { Embeddable, Property } from '@mikro-orm/core';
import Decimal from 'decimal.js';

import { DecimalType } from '@domain/database/types/decimal.type';

export interface ScenarioPayrollProps {
    nrOfWorkersWithLWGap: number;
    avgLivingWageGap: Decimal;
    largestLivingWageGap: Decimal;
    sumAnnualLivingWageGapAllWorkers: Decimal;
}

@Embeddable()
export class ScenarioPayroll {
    @Property({ columnType: 'integer', unsigned: true, default: 0, fieldName: 'num_workers_lwgap' })
    private readonly _nrOfWorkersWithLWGap: number;

    @Property({ columnType: 'numeric(12,4)', type: DecimalType, unsigned: true, default: 0, fieldName: 'avg_lwgap' })
    private readonly _avgLivingWageGap: Decimal;

    @Property({ columnType: 'numeric(12,4)', type: DecimalType, unsigned: true, default: 0, fieldName: 'largest_lwgap' })
    private readonly _largestLivingWageGap: Decimal;

    @Property({ columnType: 'numeric(12,4)',type: DecimalType, unsigned: true, default: 0, fieldName: 'sum_lwgap_allworkers' })
    private readonly _sumAnnualLivingWageGapAllWorkers: Decimal;

    constructor(props?: ScenarioPayrollProps) {
        if (props) {
            // Note: These fields are updated via a custom query (triggered via the service)
            this._nrOfWorkersWithLWGap = props.nrOfWorkersWithLWGap ?? 0;
            this._avgLivingWageGap = props.avgLivingWageGap ?? new Decimal(0);
            this._largestLivingWageGap = props.largestLivingWageGap ?? new Decimal(0);
            this._sumAnnualLivingWageGapAllWorkers = props.sumAnnualLivingWageGapAllWorkers ?? new Decimal(0);
        }
    }

    get nrOfWorkersWithLWGap() {
        return this._nrOfWorkersWithLWGap;
    }

    get avgLivingWageGap() {
        return this._avgLivingWageGap;
    }

    get largestLivingWageGap() {
        return this._largestLivingWageGap;
    }

    get sumAnnualLivingWageGapAllWorkers() {
        return this._sumAnnualLivingWageGapAllWorkers;
    }
}
