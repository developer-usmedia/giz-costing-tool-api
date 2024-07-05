import { Embeddable, Property } from '@mikro-orm/core';

import { Guard } from '@domain/utils/guard';

export interface EntryPayrollProps {
    year: number;
    currencyCode?: string;
    // Temp add them here. Remove when fields are updated via a service call
    nrOfJobCategories?: number;
    nrOfWorkers?: number;
    nrOfWorkersWithLWGap?: number;
    avgLivingWageGap?: number;
    largestLivingWageGap?: number;
    sumAnnualLivingWageGapAllWorkers?: number;
}

@Embeddable()
export class EntryPayroll {
    @Property({ columnType: 'smallint', length: 4, unsigned: true })
    private _year: number;

    @Property({ length: 3, nullable: true, fieldName: 'currency_code' })
    private _currencyCode?: string;

    // TODO: Make sure there is an update query in the service for these columns
    @Property({ columnType: 'integer', unsigned: true, default: 0, fieldName: 'num_job_categories' })
    private readonly _nrOfJobCategories: number;

    @Property({ columnType: 'integer', unsigned: true, default: 0, fieldName: 'num_workers' })
    private readonly _nrOfWorkers: number;

    @Property({ columnType: 'integer', unsigned: true, default: 0, fieldName: 'num_workers_lwgap' })
    private readonly _nrOfWorkersWithLWGap: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true, default: 0, fieldName: 'avg_lwgap' })
    private readonly _avgLivingWageGap: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true, default: 0, fieldName: 'largest_lwgap' })
    private readonly _largestLivingWageGap: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true, default: 0, fieldName: 'sum_lwgap_allworkers' })
    private readonly _sumAnnualLivingWageGapAllWorkers: number;
    // TODO: End

    constructor(props: EntryPayrollProps) {
        this.year = props.year;
        this.currencyCode = props.currencyCode ?? null;

        // Note: These fields are updated via a custom query (triggered via the service)
        this._nrOfJobCategories = props.nrOfJobCategories ?? 0;
        this._nrOfWorkers = props.nrOfWorkers ?? 0;
        this._nrOfWorkersWithLWGap = props.nrOfWorkersWithLWGap ??  0;
        this._avgLivingWageGap = props.avgLivingWageGap ?? 0;
        this._largestLivingWageGap = props.largestLivingWageGap ?? 0;
        this._sumAnnualLivingWageGapAllWorkers = props.sumAnnualLivingWageGapAllWorkers ?? 0;
    }

    get year() {
        return this._year;
    }

    get currencyCode() {
        return this._currencyCode ?? null;
    }

    get nrOfJobCategories() {
        return this._nrOfJobCategories ?? 0;
    }

    get nrOfWorkers() {
        return this._nrOfWorkers ?? 0;
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

    private set year(value: number) {
        Guard.check(value, { type: 'number', min: 2020, max: 2050 });
        this._year = value;
    }

    private set currencyCode(value: string) {
        Guard.check(value, { type: 'string', optional: true, maxLength: 3, minLength: 3 });
        this._currencyCode = value;
    }

    public isComplete(): boolean {
        return !!this._year
            && !!this._currencyCode;
            // && (this._nrOfWorkers > 0); // TODO: Renable after workers are imported
    }
}
