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
        console.log("entry-worker-remunderation-props")
        console.log(props)
        if (props) {
            this.baseWage = props.baseWage;
            this.bonuses = props.bonuses ?? new Decimal(0);
            this.ikbHousing = props.ikbHousing ?? new Decimal(0);
            this.ikbFood = props.ikbFood ?? new Decimal(0);
            this.ikbTransport = props.ikbTransport ?? new Decimal(0);
            this.ikbHealthcare = props.ikbHealthcare ?? new Decimal(0);
            this.ikbChildcare = props.ikbChildcare ?? new Decimal(0);
            this.ikbChildEducation = props.ikbChildEducation ?? new Decimal(0);

            this.updateIKB();
        }
    }

    get baseWage() {
        return this._baseWage;
    }

    get bonuses() {
        return this._bonuses;
    }

    get ikb() {
        return this._ikb;
    }

    get ikbHousing() {
        return this._ikbHousing;
    }

    get ikbFood() {
        return this._ikbFood;
    }

    get ikbTransport() {
        return this._ikbTransport;
    }

    get ikbHealthcare() {
        return this._ikbHealthcare;
    }

    get ikbChildcare() {
        return this._ikbChildcare;
    }

    get ikbChildEducation() {
        return this._ikbChildEducation;
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
        // TODO: fix guard checka dn importer error
        this._ikbChildEducation = value;
    }

    public total() {
        console.log('basewage', this.baseWage.toDP(4))
        console.log('bonuses', this.bonuses.toDP(4))
        console.log('ikb', this.ikb.toDP(4))
        console.log('total', this.baseWage.plus(this.bonuses).plus(this.ikb).toDP(4));

        // Benchmark 1000
        // basewage 958.3333
        // bonuses 12.5
        // ikb 29.1666
        // total 999.9999

        return new Decimal(this.baseWage ?? 0).plus(new Decimal(this.bonuses ?? 0)).plus(new Decimal(this.ikb ?? 0))
    }

    private updateIKB() {
        this._ikb = new Decimal(this.ikbHousing)
            .plus(new Decimal(this.ikbFood))
            .plus(new Decimal(this.ikbTransport))
            .plus(new Decimal(this.ikbHealthcare))
            .plus(new Decimal(this.ikbChildcare))
            .plus(new Decimal(this.ikbChildEducation))
    }
}
