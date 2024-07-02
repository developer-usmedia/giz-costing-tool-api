import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { AbstractEntity } from '@domain/entities/base/abstract.entity';
import { Guard } from '@domain/utils/guard';
import { EntryWorker } from './entry-worker.entity';
import { Scenario } from './scenario.entity';

// Temp distribution values
const wagePerc = 0.4;
const bonusPerc = 0.3;
const ikbFoodPerc = 0.05;
const ikbTransportPerc = 0.05;
const ikbHousingPerc = 0.05;
const ikbHealthcarePerc = 0.05;
const ikbChildcarePerc = 0.1;
const totalIkbPerc = ikbFoodPerc + ikbTransportPerc + ikbHousingPerc + ikbHealthcarePerc + ikbChildcarePerc;

// TODO: update other column values to numeric(12, 4) from numeric (19, 4)

@Entity()
export class ScenarioWorker extends AbstractEntity<ScenarioWorker> {
    @ManyToOne(() => Scenario, { deleteRule: 'cascade', eager: true })
    private readonly _scenario: Scenario;

    @ManyToOne(() => EntryWorker, { deleteRule: 'cascade', eager: true })
    private readonly _original: EntryWorker;

    @Property({ columnType: 'numeric(12,4)', unsigned: true, nullable: true })
    private _remunerationIncrease: number;

    constructor(props: { scenario: Scenario; worker: EntryWorker; remunerationIncrease?: number }) {
        super();

        this._scenario = props.scenario;
        this._original = props.worker;
        this.remunerationIncrease = props.remunerationIncrease ?? 0;
    }

    get scenario() {
        return this._scenario;
    }
    get original() {
        return this._original;
    }

    // From props, otherwise value set as default on scenario spec. Always close LW gap so take gap if thats the largest
    get remunerationIncrease(): number {
        if (this._remunerationIncrease) {
            return this.remunerationIncrease;
        }

        return Math.max(this.scenario.specifications.absoluteIncrease, this.lwGap);
    }
    get monthlyBonus(): number {
        return this.original.monthlyBonus + this.remunerationIncrease * wagePerc;
    }
    get monthlyWage(): number {
        return this.original.monthlyWage + this.remunerationIncrease * bonusPerc;
    }
    get inKindBenefits() {
        return {
            ikbFood: this.original.inKindBenefits.ikbFood + this.remunerationIncrease * ikbFoodPerc,
            ikbTransportation:
                this.original.inKindBenefits.ikbTransportation + this.remunerationIncrease * ikbTransportPerc,
            ikbHousing: this.original.inKindBenefits.ikbHousing + this.remunerationIncrease * ikbHousingPerc,
            ikbHealthcare: this.original.inKindBenefits.ikbFood + this.remunerationIncrease * ikbHealthcarePerc,
            ikbChildcare: this.original.inKindBenefits.ikbFood + this.remunerationIncrease * ikbChildcarePerc,
            totalCosts: this.original.inKindBenefits.sumAll + this.remunerationIncrease * totalIkbPerc,
        };
    }

    get additionalCostsWage(): number {
        return Math.max(0, this.monthlyWage - this.original.monthlyWage);
    }

    get additionalCostsBonus(): number {
        return Math.max(0, this.monthlyBonus - this.original.monthlyBonus);
    }

    get additionalCostsIkb() {
        // TODO: use type
        return {
            totalCosts: this.inKindBenefits.totalCosts - this.original.inKindBenefits.sumAll,
            ikbFood: this.inKindBenefits.ikbFood - this.original.inKindBenefits.ikbFood,
            ikbTransportation: this.inKindBenefits.ikbTransportation - this.original.inKindBenefits.ikbTransportation,
            ikbHousing: this.inKindBenefits.ikbHousing - this.original.inKindBenefits.ikbHousing,
            ikbHealthcare: this.inKindBenefits.ikbHealthcare - this.original.inKindBenefits.ikbHealthcare,
            ikbChildcare: this.inKindBenefits.ikbChildcare - this.original.inKindBenefits.ikbChildcare,
        };
    }

    get remainingAbsoluteGap(): number {
        return this.lwGap;
    }

    get remainingNumberBelowLW(): number {
        return this.isBelowLW ? this.original.numberOfWorkers : 0;
    }

    get lwGap(): number {
        return this.scenario.entry.benchmark.localValue - this.totalRenumeration;
    }

    get isBelowLW(): boolean {
        return this.lwGap > 0;
    }

    get totalRenumeration(): number {
        return this.original.totalRenumeration + this.remunerationIncrease;
    }

    get totalAdditionalCosts(): number {
        return this.remunerationIncrease * this.original.numberOfWorkers;
    }

    set remunerationIncrease(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._remunerationIncrease = value;
    }
}
