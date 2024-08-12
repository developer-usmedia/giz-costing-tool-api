import { Embeddable, Property } from '@mikro-orm/core';
import Decimal from 'decimal.js';

import { DecimalType } from '@domain/database/types/decimal.type';
import { Guard } from '@domain/utils/guard';

export interface EntryWorkerRemunerationProps {
    baseWage: Decimal;
    bonuses?: Decimal;
    ikbHousing?: Decimal;
    ikbFood?: Decimal;
    ikbTransport?: Decimal;
    ikbHealthcare?: Decimal;
    ikbChildcare?: Decimal;
    ikbChildEducation?: Decimal;
}

@Embeddable()
export class EntryWorkerRemuneration {
    @Property({ columnType: 'numeric(14,4)', type: DecimalType, unsigned: true, fieldName: 'base_wage' })
    private _baseWage: Decimal;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType, unsigned: true, fieldName: 'bonuses' })
    private _bonuses: Decimal;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType, unsigned: true, fieldName: 'ikb' })
    private _ikb: Decimal;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType, unsigned: true, fieldName: 'ikb_housing' })
    private _ikbHousing: Decimal;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType, unsigned: true, fieldName: 'ikb_food' })
    private _ikbFood: Decimal;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType, unsigned: true, fieldName: 'ikb_transport' })
    private _ikbTransport: Decimal;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType, unsigned: true, fieldName: 'ikb_healthcare' })
    private _ikbHealthcare: Decimal;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType, unsigned: true, fieldName: 'ikb_childcare' })
    private _ikbChildcare: Decimal;

    @Property({ columnType: 'numeric(14,4)', type: DecimalType, unsigned: true, fieldName: 'ikb_child_education' })
    private _ikbChildEducation: Decimal;

    constructor(props?: EntryWorkerRemunerationProps) {
        if (props) {
            this.baseWage = props.baseWage;
            this.bonuses = props.bonuses;
            this.ikbHousing = props.ikbHousing;
            this.ikbFood = props.ikbFood;
            this.ikbTransport = props.ikbTransport;
            this.ikbHealthcare = props.ikbHealthcare;
            this.ikbChildcare = props.ikbChildcare;
            this.ikbChildEducation = props.ikbChildEducation;

            this.updateIKB();
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

    get ikbHousing() {
        return this._ikbHousing ?? new Decimal(0);
    }

    get ikbFood() {
        return this._ikbFood ?? new Decimal(0);
    }

    get ikbTransport() {
        return this._ikbTransport ?? new Decimal(0);
    }

    get ikbHealthcare() {
        return this._ikbHealthcare ?? new Decimal(0);
    }

    get ikbChildcare() {
        return this._ikbChildcare ?? new Decimal(0);
    }

    get ikbChildEducation() {
        return this._ikbChildEducation ?? new Decimal(0);
    }

    private set baseWage(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._baseWage = value;
    }

    private set bonuses(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._bonuses = value;
    }

    private set ikbHousing(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._ikbHousing = value;
    }

    private set ikbFood(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._ikbFood = value;
    }

    private set ikbTransport(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._ikbTransport = value;
    }

    private set ikbHealthcare(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._ikbHealthcare = value;
    }

    private set ikbChildcare(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._ikbChildcare = value;
    }

    private set ikbChildEducation(value: Decimal) {
        Guard.check(value.toNumber(), { type: 'number', min: 0, max: 9999999999.99 });
        this._ikbChildEducation = value;
    }

    public total() {
        return this.baseWage
                .plus(this.bonuses)
                .plus(this.ikbFood)
                .plus(this.ikbTransport)
                .plus(this.ikbHealthcare)
                .plus(this.ikbChildcare)
                .plus(this.ikbChildEducation);
    }

    private updateIKB() {
        this._ikb = this.ikbHousing
            .plus(this.ikbFood)
            .plus(this.ikbTransport)
            .plus(this.ikbHealthcare)
            .plus(this.ikbChildcare)
            .plus(this.ikbChildEducation);
    }
}
