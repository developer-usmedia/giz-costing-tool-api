import { Embeddable, Property } from '@mikro-orm/core';
import Decimal from 'decimal.js';

import { DecimalType } from '@domain/database/types/decimal.type';
import { Guard } from '@domain/utils/guard';

export interface EntryWorkerRemunerationProps {
    baseWage: Decimal;
    bonuses?: Decimal;
    ikb?: Decimal;
}

@Embeddable()
export class EntryWorkerRemuneration {
    @Property({ columnType: 'numeric(14,4)', type: DecimalType, unsigned: true, fieldName: 'base_wage' })
    private _baseWage: Decimal;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType, unsigned: true, fieldName: 'bonuses' })
    private _bonuses: Decimal;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType, unsigned: true, fieldName: 'ikb' })
    private _ikb: Decimal;

    constructor(props?: EntryWorkerRemunerationProps) {
        if (props) {
            this.baseWage = props.baseWage;
            this.bonuses = props.bonuses;
            this.ikb = props.ikb;
        }
    }

    get baseWage() {
        return this._baseWage ?? new Decimal(0);
    }

    get bonuses() {
        return this._bonuses ?? new Decimal(0);
    }

    get ikb() {
        return this._ikb ?? new Decimal(0);
    }

    private set baseWage(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._baseWage = value;
    }

    private set bonuses(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._bonuses = value;
    }

    private set ikb(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._ikb = value;
    }

    public total() {
        return this.baseWage
                .plus(this.bonuses)
                .plus(this.ikb);
    }
}
