import { Embeddable, Property } from '@mikro-orm/core';

import { Guard } from '@domain/utils/guard';

export interface ScenarioReportProps {
    remunerationIncrease: number;
    taxCosts: number;
    overheadCosts: number;
    totalCosts: number;
    totalCostsPerUnit: number;
}

@Embeddable()
export class ScenarioReport {
    @Property({ columnType: 'numeric(14,4)', fieldName: 'remuneration_increase' })
    private _remunerationIncrease?: number;

    @Property({ columnType: 'numeric(14,4)', fieldName: 'tax_costs' })
    private _taxCosts?: number;

    @Property({ columnType: 'numeric(14,4)', fieldName: 'overhead_costs' })
    private _overheadCosts?: number;

    @Property({ columnType: 'numeric(14,4)', fieldName: 'total_costs' })
    private _totalCosts?: number;

    @Property({ columnType: 'numeric(14,4)', fieldName: 'total_costs_per_unit' })
    private _totalCostsPerUnit?: number;

    @Property({ columnType: 'timestamp', defaultRaw: 'now()' })
    private readonly _calculatedAt!: Date;

    constructor(props: ScenarioReportProps) {
        this.remunerationIncrease = props.remunerationIncrease;
        this.taxCosts = props.taxCosts;
        this.overheadCosts = props.overheadCosts;
        this.totalCosts = props.totalCosts;
        this.totalCostsPerUnit = props.totalCostsPerUnit;

        this._calculatedAt = new Date();
    }

    get remunerationIncrease() {
        return this._remunerationIncrease;
    }

    get taxCosts() {
        return this._taxCosts;
    }

    get overheadCosts() {
        return this._overheadCosts;
    }

    get totalCosts() {
        return this._totalCosts;
    }

    get totalCostsPerUnit() {
        return this._totalCostsPerUnit;
    }

    get calculatedAt() {
        return this._calculatedAt;
    }

    private set remunerationIncrease(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._remunerationIncrease = value;
    }

    private set taxCosts(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._taxCosts = value;
    }

    private set overheadCosts(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._overheadCosts = value;
    }

    private set totalCosts(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._totalCosts = value;
    }

    private set totalCostsPerUnit(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._totalCostsPerUnit = value;
    }
}
