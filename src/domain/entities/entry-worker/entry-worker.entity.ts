import { Embedded, Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import Decimal from 'decimal.js';

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

    private livingWageResult: null | {
        livingWageGap: Decimal;
        livingWageGapPerc: Decimal;
        annualLivingWageGap: Decimal;
        annualLivingWageGapAllWorkers: Decimal;
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

    get isBelowLw(): boolean {
        return this.livingWageResult?.livingWageGap.greaterThan(0);
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

        const livingWageBenchmark = new Decimal(this._entry.benchmark.value);
        const monthlyTotalRemuneration = new Decimal(this._remuneration.total());
        const monthlyGap = Decimal.max(livingWageBenchmark.minus(monthlyTotalRemuneration), new Decimal(0));
        const annualGap = monthlyGap.times(new Decimal(12)).times((new Decimal(this._percOfYearWorked).dividedBy(new Decimal(100))));
        const livingWagePerc = monthlyGap.dividedBy(livingWageBenchmark).times(new Decimal(100));

        this.livingWageResult = {
            livingWageGap: monthlyGap,
            livingWageGapPerc: livingWagePerc,
            annualLivingWageGap: annualGap,
            annualLivingWageGapAllWorkers: annualGap.times(this._nrOfWorkers),
        };
    }
}
