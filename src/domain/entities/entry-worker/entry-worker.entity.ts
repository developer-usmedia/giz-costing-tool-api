import { Embedded, Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import {
    AbstractEntity,
    Entry,
    EntryWorkerRemuneration, EntryWorkerRemunerationProps,
    Gender, GENDER_OPTIONS,
} from '@domain/entities';
import { Guard } from '@domain/utils/guard';

export interface EntryWorkerProps {
    entry: Entry;
    name: string;
    gender: Gender;
    nrOfWorkers: number;
    percOfYearWorked: number;
    remuneration: EntryWorkerRemunerationProps;
}

@Entity()
export class EntryWorker extends AbstractEntity<EntryWorker> {
    @ManyToOne(() => Entry, { deleteRule: 'cascade', eager: true })
    private readonly _entry: Entry;

    @Property()
    private _name: string;

    @Enum({ items: () => GENDER_OPTIONS })
    private _gender: Gender;

    @Property({ columnType: 'integer', unsigned: true })
    private _nrOfWorkers: number;

    @Property({ columnType: 'numeric(5,2)', unsigned: true })
    private _percOfYearWorked: number;

    @Embedded({ entity: () => EntryWorkerRemuneration, prefix: false })
    private _remuneration: EntryWorkerRemuneration;

    // TODO Q for J: give this its own type? If so, why? Or is this inline ok for the small type that it is?
    private livingWageResult: null | {
        livingWageGap: number;
        annualLivingWageGap: number;
        annualLivingWageGapAllWorkers: number;
    };

    constructor(props: EntryWorkerProps) {
        super();

        this._entry = props.entry;
        this._remuneration = new EntryWorkerRemuneration(props.remuneration);

        this.name = props.name;
        this.gender = props.gender;
        this.nrOfWorkers = props.nrOfWorkers;
        this.percOfYearWorked = props.percOfYearWorked;
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

    get nrOfWorkers() {
        return this._nrOfWorkers;
    }

    get percOfYearWorked() {
        return this._percOfYearWorked;
    }

    get remuneration() {
        return this._remuneration;
    }

    set name(value: string) {
        Guard.check(value, { type: 'string' });
        this._name = value;
    }

    set gender(value: Gender) {
        Guard.check(value, { type: 'string', options: GENDER_OPTIONS });
        this._gender = value;
    }

    set nrOfWorkers(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 999999 });
        this._nrOfWorkers = value;
    }

    set percOfYearWorked(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 100 });
        this._percOfYearWorked = value;
    }

    public setRemuneration(remuneration: EntryWorkerRemunerationProps) {
        this._remuneration = new EntryWorkerRemuneration(remuneration);
    }

    public livingWage() {
        if (this.livingWageResult !== undefined) {
            return this.livingWageResult;
        }

        this.calculate();
        return this.livingWageResult;
    }

    public calculate() {
        if (!this._entry.benchmark.isComplete()) {
            this.livingWageResult = null;
            return;
        }

        const livingWageBenchmark = this._entry.benchmark.value;
        const monthlyTotalRemuneration = this._remuneration.total();
        const monthlyGap = Math.max(livingWageBenchmark - monthlyTotalRemuneration, 0);
        const annualGap = (monthlyGap / 100) * this._percOfYearWorked;

        this.livingWageResult = {
            livingWageGap: monthlyGap,
            annualLivingWageGap: annualGap,
            annualLivingWageGapAllWorkers: annualGap * this._nrOfWorkers,
        };
    }
}
