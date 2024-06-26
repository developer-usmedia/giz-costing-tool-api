import { Embeddable, Property } from '@mikro-orm/core';

import { Guard } from '@domain/utils/guard';

@Embeddable()
export class ScenarioSpecification {
    // TODO: naming strategy does not support embeddables with _ propertyNames
    @Property({ columnType: 'numeric(5,2)', default: 0, fieldName: 'employee_tax' })
    private _employeeTax: number;

    @Property({ columnType: 'numeric(5,2)', default: 0, fieldName: 'employer_tax' })
    private _employerTax: number;

    @Property({ columnType: 'numeric(19,4)', default: 0, fieldName: 'absolute_increase' })
    private _absoluteIncrease?: number;

    constructor(props: { 
        employeeTax?: number; 
        employerTax?: number; 
        absoluteIncrease?: number;
    }) {
        this.employeeTax = props.employeeTax ?? 0;
        this.employerTax = props.employerTax ?? 0;
        this.absoluteIncrease = props.absoluteIncrease ?? 0;
    }

    get employeeTax() {
        return this._employeeTax;
    }
    get employerTax() {
        return this._employerTax;
    }
    get absoluteIncrease() {
        return this._absoluteIncrease;
    }

    set employeeTax(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 100 });
        this._employeeTax = value;
    }

    set employerTax(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 100 });
        this._employerTax = value;
    }

    set absoluteIncrease(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._absoluteIncrease = value;
    }
}
