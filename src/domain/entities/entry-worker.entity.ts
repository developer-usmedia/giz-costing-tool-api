import { Embedded, Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { WorkerIKB } from '@domain/embeddables/worker-ikb.embed';
import { AbstractEntity } from '@domain/entities/base/abstract.entity';
import { Entry } from '@domain/entities/entry.entity';
import { Gender } from '@domain/enums/gender.enum';
import { Guard } from '@domain/utils/guard';

@Entity()
export class EntryWorker extends AbstractEntity<EntryWorker> {
    @ManyToOne(() => Entry, { deleteRule: 'cascade', eager: true })
    private _entry: Entry;

    @Property({ length: 100 })
    private _name: string;

    @Enum(() => Gender)
    private _gender: Gender;

    @Property({ columnType: 'numeric(6,0)', default: 1 })
    private _numberOfWorkers: number;

    @Property({ columnType: 'numeric(8,2)' })
    private _monthlyWage: number;

    @Property({ columnType: 'numeric(8,2)' })
    private _monthlyBonus: number;

    @Property({ columnType: 'numeric(5,2)' })
    private _percentageOfYearWorked: number;

    @Property({ columnType: 'numeric(5,2)' })
    private _employeeTax: number;

    @Property({ columnType: 'numeric(5,2)' })
    private _employerTax: number;

    @Embedded({ entity: () => WorkerIKB, prefix: false })
    private _monthlyIkb?: WorkerIKB;

    constructor(props: {
        entry: Entry;
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

        this.entry = props.entry;

        this.name = props.name;
        this.gender = props.gender;
        this.numberOfWorkers = props.numberOfWorkers;
        this.monthlyWage = props.monthlyWage;
        this.monthlyBonus = props.monthlyBonus;
        this.percentageOfYearWorked = props.percentageOfYearWorked;
        this.employeeTax = props.employeeTax;
        this.employerTax = props.employerTax;
        this.inKindBenefits = this.inKindBenefits ?? new WorkerIKB({});
    }

    get entry() {
        return this._entry;
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
        return this._monthlyIkb;
    }
    get totalRenumeration(): number {
        return this.monthlyWage + this.monthlyBonus + this.inKindBenefits.sumAll;
    }
    get isBelowLW(): boolean {
        return this.entry?.benchmark?.localValue > this.totalRenumeration;
    }

    set entry(value: Entry) {
        Guard.check(value, { type: 'object' });
        this._entry = value;
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
        Guard.check(value, { type: 'number', min: 0, max: 999999 });
        this._numberOfWorkers = value;
    }
    set monthlyWage(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 999999.99 });
        this._monthlyWage = value;
    }
    set monthlyBonus(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 999999.99 });
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
        this._monthlyIkb = value;
    }
}
