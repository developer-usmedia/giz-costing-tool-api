import { Collection, Embedded, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { EntryBenchmark } from '@domain/embeddables/entry-benchmark.embed';
import { EntryFacility } from '@domain/embeddables/entry-facility.embed';
import { AbstractEntity } from '@domain/entities/base/abstract.entity';
import { User } from '@domain/entities/user.entity';
import { Worker } from '@domain/entities/worker.entity';
import { EntryStatus } from '@domain/enums/entry-status.enum';
import { Guard } from '@domain/utils/guard';

@Entity()
export class Entry extends AbstractEntity<Entry> {
    @Property({ nullable: true })
    private _matrixId: string;

    @Property()
    private _year: number;

    @ManyToOne(() => User, { deleteRule: 'cascade', eager: true })
    private _user: User;

    @Enum({ items: () => EntryStatus, default: EntryStatus.OPEN })
    private _status: EntryStatus;

    @Embedded({ entity: () => EntryFacility, prefix: 'facility_' })
    private _facility: EntryFacility;

    @Embedded({ entity: () => EntryBenchmark, prefix: 'benchmark_' })
    private _benchmark: EntryBenchmark;

    // eslint-disable-next-line @typescript-eslint/dot-notation
    @OneToMany({ entity: () => Worker, mappedBy: (worker) => worker['_entry'], nullable: true, eager: true })
    private readonly _workers? = new Collection<Worker>(this); // For now fetch eager to populate table, think of a different way

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: 0 })
    private _defaultEmployerTax?: number; //  Percentage (0 - 100)

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: 0 })
    private _defaultEmployeeTax?: number; // Percentage (0 - 100)

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: 0 })
    private _administrativeCosts: number;

    constructor(props: {
        year: number;
        user: User;
        facility: EntryFacility;
        matrixId?: string;
        status?: EntryStatus;
        benchmark?: EntryBenchmark;
    }) {
        super();
        this.matrixId = props.matrixId;
        this.year = props.year;
        this.user = props.user;
        this.facility = props.facility;

        this.status = props.status ?? EntryStatus.OPEN;
        this.benchmark = props.benchmark ?? new EntryBenchmark({});
    }

    get matrixId() {
        return this._matrixId;
    }
    get year() {
        return this._year;
    }
    get user() {
        return this._user;
    }
    get facility() {
        return this._facility;
    }
    get status() {
        return this._status;
    }
    get benchmark() {
        return this._benchmark;
    }
    get workers() {
        return this._workers;
    }
    get defaultEmployerTax() {
        return this._defaultEmployerTax;
    }
    get defaultEmployeeTax() {
        return this._defaultEmployeeTax;
    }
    get administrativeCosts() {
        return this._administrativeCosts;
    }

    set matrixId(value: string) {
        Guard.check(value, { type: 'string', optional: true, allowEmpty: true });
        this._matrixId = value;
    }

    set year(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999 });
        this._year = value;
    }

    set user(value: User) {
        Guard.check(value, { type: 'object' });
        this._user = value;
    }

    set facility(value: EntryFacility) {
        Guard.check(value, { type: 'object' });
        this._facility = value;
    }

    set status(value: EntryStatus) {
        Guard.check(value, { type: 'string' });
        if (!Object.values(EntryStatus).includes(value)) {
            throw new Error(`Status (${value}} is not a EntryStatus`);
        }
        this._status = value;
    }

    set benchmark(value: EntryBenchmark) {
        Guard.check(value, { type: 'object' });
        this._benchmark = value;
    }

    set defaultEmployerTax(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 100 });
        this._defaultEmployerTax = value;
    }

    set defaultEmployeeTax(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 100 });
        this._defaultEmployeeTax = value;
    }

    set administrativeCosts(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._administrativeCosts = value;
    }
    
    public addWorker(worker: Worker): void {
        this._workers.add(worker);
    }
}
