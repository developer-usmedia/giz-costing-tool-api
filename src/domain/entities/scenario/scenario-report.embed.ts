import { Embeddable, Property } from '@mikro-orm/core';
import Decimal from 'decimal.js';

import { DecimalType } from '@domain/database/types/decimal.type';
import { Guard } from '@domain/utils/guard';

export interface ScenarioReportProps {
    remunerationIncrease: Decimal;
    taxCosts: Decimal;
    overheadCosts: number;
    totalCosts: Decimal;
    totalCostsPerUnit: Decimal;
}

@Embeddable()
export class ScenarioReport {
    @Property({ columnType: 'numeric(14,4)', type: DecimalType, fieldName: 'remuneration_increase' })
    private _remunerationIncrease?: Decimal;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType,fieldName: 'tax_costs' })
    private _taxCosts?: Decimal;

    @Property({ columnType: 'numeric(14,4)', fieldName: 'overhead_costs' })
    private _overheadCosts?: number;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType,fieldName: 'total_costs' })
    private _totalCosts?: Decimal;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType, fieldName: 'total_costs_per_unit' })
    private _totalCostsPerUnit?: Decimal;

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

    private set remunerationIncrease(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._remunerationIncrease = value;
    }

    private set taxCosts(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._taxCosts = value;
    }

    private set overheadCosts(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._overheadCosts = value;
    }

    private set totalCosts(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._totalCosts = value;
    }

    private set totalCostsPerUnit(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._totalCostsPerUnit = value;
    }

    public isComplete(): boolean {
        return (
            this._remunerationIncrease !== null &&
            this._taxCosts !== null &&
            this._overheadCosts !== null &&
            this._totalCosts !== null &&
            this._totalCostsPerUnit !== null
        );
    }
}
