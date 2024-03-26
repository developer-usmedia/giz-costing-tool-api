import { Embedded, Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { Gender } from '@common/enums/gender.enum';
import { Guard } from '@common/utils/guard';
import { WorkerIKB } from '@database/embeddables/worker-ikb.embeddable';
import { AbstractEntity } from './base/abstract.entity';
import { Simulation } from './simulation.entity';

@Entity()
export class Worker extends AbstractEntity<Worker> {
    @ManyToOne(() => Simulation, { deleteRule: 'cascade' })
    private _simulation: Simulation;

    @Property({ length: 100 })
    private _name: string;

    @Enum(() => Gender)
    private _gender: Gender;

    @Property({ default: 1 })
    private _numberOfWorkers: number;

    @Property()
    private _monthlyWage: number;

    @Property()
    private _monthlyBonus: number;

    @Property({ length: 3 })
    private _percentageOfYearWorked: number;

    @Property({ length: 3 })
    private _employeeTax: number;

    @Property({ length: 3 })
    private _employerTax: number;

    @Embedded({ entity: () => WorkerIKB, prefix: false })
    private _inKindBenefits?: WorkerIKB;

    constructor(props: {
        simulation: Simulation;
        name: string;
        gender: Gender;
        numberOfWorkers: number;
        monthlyWage: number;
        monthlyBonus: number;
        percentageOfYearWorked: number;
        employeeTax: number;
        employerTax: number;
        inKindBenefits?: WorkerIKB;
    }) {
        super();

        this.simulation = props.simulation;

        this.name = props.name;
        this.gender = props.gender;
        this.numberOfWorkers = props.numberOfWorkers;
        this.monthlyWage = props.monthlyWage;
        this.monthlyBonus = props.monthlyBonus;
        this.percentageOfYearWorked = props.percentageOfYearWorked;
        this.employeeTax = props.employeeTax;
        this.employerTax = props.employerTax;
        this.inKindBenefits = this.inKindBenefits ?? new WorkerIKB();
    }

    get simulation() {
        return this._simulation;
    }
    get name() {
        return this._name;
    }
    get gender() {
        return this._gender;
    }
    get numberOfWorkers() {
        return this._numberOfWorkers;
    }
    get monthlyWage() {
        return this._monthlyWage;
    }
    get monthlyBonus() {
        return this._monthlyBonus;
    }
    get percentageOfYearWorked() {
        return this._percentageOfYearWorked;
    }
    get employeeTax() {
        return this._employeeTax;
    }
    get employerTax() {
        return this._employerTax;
    }
    get inKindBenefits() {
        return this._inKindBenefits;
    }

    set simulation(value: Simulation) {
        Guard.check(value, { type: 'object' });
        this._simulation = value;
    }
    set name(value: string) {
        Guard.check(value, { type: 'string' });
        this._name = value;
    }
    set gender(value: Gender) {
        Guard.check(value, { type: 'string' });
        if (!Object.values(Gender).includes(value)) {
            throw new Error(`Gender (${value}} is not a Gender`);
        }
        this._gender = value;
    }
    set numberOfWorkers(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._numberOfWorkers = value;
    }
    set monthlyWage(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._monthlyWage = value;
    }
    set monthlyBonus(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._monthlyBonus = value;
    }
    set percentageOfYearWorked(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 100 });
        this._percentageOfYearWorked = value;
    }
    set employeeTax(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 100 });
        this._employeeTax = value;
    }
    set employerTax(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 100 });
        this._employerTax = value;
    }
    set inKindBenefits(value: WorkerIKB) {
        Guard.check(value, { type: 'object' });
        this._inKindBenefits = value;
    }
}
