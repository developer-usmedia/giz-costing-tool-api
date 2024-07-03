import { Guard } from '@domain/utils/guard';
import { Embeddable, Property } from '@mikro-orm/core';

export interface ScenarioWorkerSpecificationProps {
    remunerationIncrease: number;
}

@Embeddable()
export class ScenarioWorkerSpecification {
    @Property({ columnType: 'numeric(12,2)', nullable: true, fieldName: 'remuneration_increase' })
    private _remunerationIncrease?: number;

    constructor(props?: ScenarioWorkerSpecificationProps) {
        if (props) {
            this.remunerationIncrease = props.remunerationIncrease;
        }
    }

    get remunerationIncrease() {
        return this._remunerationIncrease ?? null;
    }

    private set remunerationIncrease(value: number) {
        Guard.check(value, { type: 'number', optional: true, min: 0, max: 9999999999.99 });
        this._remunerationIncrease = value;
    }
    
    public isEmpty() {
        return !this._remunerationIncrease;
    }
}
