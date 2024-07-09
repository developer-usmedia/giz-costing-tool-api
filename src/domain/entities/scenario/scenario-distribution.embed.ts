import { Embeddable, Property } from '@mikro-orm/core';

import { Guard } from '@domain/utils/guard';

export interface ScenarioDistributionProps {
    bonusesPerc?: number;
    ikbHousingPerc?: number;
    ikbFoodPerc?: number;
    ikbTransportPerc?: number;
    ikbHealthcarePerc?: number;
    ikbChildcarePerc?: number;
    ikbChildEducationPerc?: number;
}

@Embeddable()
export class ScenarioDistribution {
    @Property({ columnType: 'numeric(5,2)', unsigned: true, nullable: true, fieldName: 'base_wage' })
    private _baseWagePerc: number;

    @Property({ columnType: 'numeric(5,2)', unsigned: true, nullable: true, fieldName: 'bonuses' })
    private _bonusesPerc: number;

    @Property({ columnType: 'numeric(5,2)', unsigned: true, nullable: true, fieldName: 'ikb' })
    private _ikbPerc: number;

    @Property({ columnType: 'numeric(5,2)', unsigned: true, nullable: true, fieldName: 'ikb_housing' })
    private _ikbHousingPerc: number;

    @Property({ columnType: 'numeric(5,2)', unsigned: true, nullable: true, fieldName: 'ikb_food' })
    private _ikbFoodPerc: number;

    @Property({ columnType: 'numeric(5,2)', unsigned: true, nullable: true, fieldName: 'ikb_transport' })
    private _ikbTransportPerc: number;

    @Property({ columnType: 'numeric(5,2)', unsigned: true, nullable: true, fieldName: 'ikb_healthcare' })
    private _ikbHealthcarePerc: number;

    @Property({ columnType: 'numeric(5,2)', unsigned: true, nullable: true, fieldName: 'ikb_childcare' })
    private _ikbChildcarePerc: number;

    @Property({ columnType: 'numeric(5,2)', unsigned: true, nullable: true, fieldName: 'ikb_child_education' })
    private _ikbChildEducationPerc: number;

    constructor(props?: ScenarioDistributionProps) {
        if (props) {
            this.bonusesPerc = props.bonusesPerc || 0;

            this.ikbHousingPerc = props.ikbHousingPerc || 0;
            this.ikbFoodPerc = props.ikbFoodPerc || 0;
            this.ikbTransportPerc = props.ikbTransportPerc || 0;
            this.ikbHealthcarePerc = props.ikbHealthcarePerc || 0;
            this.ikbChildcarePerc = props.ikbChildcarePerc || 0;
            this.ikbChildEducationPerc = props.ikbChildEducationPerc || 0;

            this.ikbPerc =
                this.ikbHousingPerc +
                this.ikbFoodPerc +
                this.ikbTransportPerc +
                this.ikbHealthcarePerc +
                this.ikbChildcarePerc +
                this.ikbChildEducationPerc;

            this.baseWagePerc = 100 - (this.bonusesPerc + this.ikbPerc);
        }
    }

    get baseWagePerc() {
        return this._baseWagePerc;
    }

    get bonusesPerc() {
        return this._bonusesPerc;
    }

    get ikbPerc() {
        return this._ikbPerc;
    }

    get ikbHousingPerc() {
        return this._ikbHousingPerc;
    }

    get ikbFoodPerc() {
        return this._ikbFoodPerc;
    }

    get ikbTransportPerc() {
        return this._ikbTransportPerc;
    }

    get ikbHealthcarePerc() {
        return this._ikbHealthcarePerc;
    }

    get ikbChildcarePerc() {
        return this._ikbChildcarePerc;
    }

    get ikbChildEducationPerc() {
        return this._ikbChildEducationPerc;
    }

    private set baseWagePerc(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 100 });
        this._baseWagePerc = value;
    }

    private set bonusesPerc(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 100 });
        this._bonusesPerc = value;
    }

    private set ikbPerc(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 30 });
        this._ikbPerc = value;
    }

    private set ikbHousingPerc(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 15 });
        this._ikbHousingPerc = value;
    }

    private set ikbFoodPerc(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 10 });
        this._ikbFoodPerc = value;
    }

    private set ikbTransportPerc(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 10 });
        this._ikbTransportPerc = value;
    }

    private set ikbHealthcarePerc(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 10 });
        this._ikbHealthcarePerc = value;
    }

    private set ikbChildcarePerc(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 10 });
        this._ikbChildcarePerc = value;
    }

    private set ikbChildEducationPerc(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 10 });
        this._ikbChildEducationPerc = value;
    }

    public isComplete(): boolean {
        return (
            this._baseWagePerc !== null &&
            this._bonusesPerc !== null &&
            this._ikbPerc !== null &&
            this._ikbHousingPerc !== null &&
            this._ikbFoodPerc !== null &&
            this._ikbTransportPerc !== null &&
            this._ikbHealthcarePerc !== null &&
            this._ikbChildcarePerc !== null &&
            this._ikbChildEducationPerc !== null
        );
    }
}
