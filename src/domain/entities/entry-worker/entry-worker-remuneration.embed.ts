import { Embeddable, Property } from '@mikro-orm/core';

import { Guard } from '@domain/utils/guard';

export interface EntryWorkerRemunerationProps {
    baseWage: number;
    bonuses?: number;
    ikbHousing?: number;
    ikbFood?: number;
    ikbTransport?: number;
    ikbHealthcare?: number;
    ikbChildcare?: number;
    ikbChildEducation?: number;
}

@Embeddable()
export class EntryWorkerRemuneration {
    @Property({ columnType: 'numeric(12,2)', unsigned: true, fieldName: 'base_wage' })
    private _baseWage: number;

    @Property({ columnType: 'numeric(12,2)', unsigned: true, fieldName: 'bonuses' })
    private _bonuses: number;

    @Property({ columnType: 'numeric(12,2)', unsigned: true, fieldName: 'ikb' })
    private _ikb: number;

    @Property({ columnType: 'numeric(12,2)', unsigned: true, fieldName: 'ikb_housing' })
    private _ikbHousing: number;

    @Property({ columnType: 'numeric(12,2)', unsigned: true, fieldName: 'ikb_food' })
    private _ikbFood: number;

    @Property({ columnType: 'numeric(12,2)', unsigned: true, fieldName: 'ikb_transport' })
    private _ikbTransport: number;

    @Property({ columnType: 'numeric(12,2)', unsigned: true, fieldName: 'ikb_healthcare' })
    private _ikbHealthcare: number;

    @Property({ columnType: 'numeric(12,2)', unsigned: true, fieldName: 'ikb_childcare' })
    private _ikbChildcare: number;

    @Property({ columnType: 'numeric(12,2)', unsigned: true, fieldName: 'ikb_child_education' })
    private _ikbChildEducation: number;

    constructor(props: EntryWorkerRemunerationProps) {
        this.baseWage = props.baseWage;
        this.bonuses = props.bonuses ?? 0;
        this.ikbHousing = props.ikbHousing ?? 0;
        this.ikbFood = props.ikbFood ?? 0;
        this.ikbTransport = props.ikbTransport ?? 0;
        this.ikbHealthcare = props.ikbHealthcare ?? 0;
        this.ikbChildcare = props.ikbChildcare ?? 0;
        this.ikbChildEducation = props.ikbChildEducation ?? 0;

        this.updateIKB();
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

    private set baseWage(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._baseWage = value;
    }

    private set bonuses(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._bonuses = value;
    }

    private set ikbHousing(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._ikbHousing = value;
    }

    private set ikbFood(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._ikbFood = value;
    }

    private set ikbTransport(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._ikbTransport = value;
    }

    private set ikbHealthcare(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._ikbHealthcare = value;
    }

    private set ikbChildcare(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._ikbChildcare = value;
    }

    private set ikbChildEducation(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._ikbChildEducation = value;
    }

    public total() {
        return this.baseWage + this.bonuses + this.ikb;
    }

    private updateIKB() {
        this._ikb =
            this.ikbHousing +
            this.ikbFood +
            this.ikbTransport +
            this.ikbHealthcare +
            this.ikbChildcare +
            this.ikbChildEducation;
    }
}
