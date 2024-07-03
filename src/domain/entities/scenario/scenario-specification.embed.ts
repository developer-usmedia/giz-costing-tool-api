import { Guard } from '@domain/utils/guard';
import { Embeddable, Property } from '@mikro-orm/core';

export interface ScenarioSpecificationProps {
    taxEmployee: number;
    taxEmployer: number;
    overheadCosts: number;
    remunerationIncrease: number;
}

@Embeddable()
export class ScenarioSpecification {
    @Property({ columnType: 'smallint', nullable: true, fieldName: 'tax_employee' })
    private _taxEmployee: number;

    @Property({ columnType: 'smallint', nullable: true, fieldName: 'tax_employer' })
    private _taxEmployer: number;

    @Property({ columnType: 'numeric(12,2)', nullable: true, fieldName: 'overhead_costs' })
    private _overheadCosts?: number;

    @Property({ columnType: 'numeric(12,2)', nullable: true, fieldName: 'remuneration_increase' })
    private _remunerationIncrease?: number;

    constructor(props?: ScenarioSpecificationProps) {
        if (props) {
            this.taxEmployee = props.taxEmployee;
            this.taxEmployer = props.taxEmployer;
            this.overheadCosts = props.overheadCosts;
            this.remunerationIncrease = props.remunerationIncrease;
        }
    }

    get taxEmployee() {
        return this._taxEmployee ?? null;
    }

    get taxEmployer() {
        return this._taxEmployer ?? null;
    }

    get overheadCosts() {
        return this._overheadCosts ?? null;
    }

    get remunerationIncrease() {
        return this._remunerationIncrease ?? null;
    }

    private set taxEmployee(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 100 });
        this._taxEmployee = value;
    }

    private set taxEmployer(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 100 });
        this._taxEmployer = value;
    }

    private set overheadCosts(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._overheadCosts = value;
    }

    private set remunerationIncrease(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._remunerationIncrease = value;
    }

    public isComplete(): boolean {
        return !!this._taxEmployee
            && !!this._taxEmployer
            && !!this._overheadCosts
            && !!this._remunerationIncrease;
    }
}
