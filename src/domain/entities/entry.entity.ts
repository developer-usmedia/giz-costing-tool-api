import { Collection, Embedded, Entity, Enum, ManyToOne, OneToMany, OneToOne, Property } from '@mikro-orm/core';

import { EntryBenchmark } from '@domain/embeddables/entry-benchmark.embed';
import { EntryFacility } from '@domain/embeddables/entry-facility.embed';
import { AbstractEntity } from '@domain/entities/base/abstract.entity';
import { User } from '@domain/entities/user.entity';
import { EntryWorker } from '@domain/entities/entry-worker.entity';
import { EntryStatus } from '@domain/enums/entry-status.enum';
import { Guard } from '@domain/utils/guard';
import { Scenario } from './scenario.entity';

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
    @OneToMany({ entity: () => EntryWorker, mappedBy: (worker) => worker['_entry'], nullable: true, eager: true })
    private readonly _workers? = new Collection<EntryWorker>(this);

    // eslint-disable-next-line @typescript-eslint/dot-notation
    @OneToOne({ entity: () => Scenario, mappedBy: (scenario) => scenario['_entry'], nullable: true, eager: true })
    private _scenario: Scenario;

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: 0 })
    private _defaultEmployerTax?: number; //  Percentage (0 - 100)

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: 0 })
    private _defaultEmployeeTax?: number; // Percentage (0 - 100)

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: 0 })
    private _administrativeCosts: number;

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true })
    private _averageLwGap: number;

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true })
    private _largestLwGap: number;

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

        this.calculcateLwGaps();
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
    get scenario() {
        return this._scenario;
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
    get averageLwGap() {
        return this._averageLwGap;
    }
    get largestLwGap() {
        return this._largestLwGap;
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

    set averageLwGap(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._averageLwGap = value;
    }

    set largestLwGap(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._largestLwGap = value;
    }

    set scenario(value: Scenario) {
        Guard.check(value, { type: 'object', optional: true });
        this._scenario = value;
    }

    public addWorker(worker: EntryWorker, { recalculateLwGaps = true }): void {
        this._workers.add(worker);

        if (recalculateLwGaps) {
            this.calculcateLwGaps();
        }
    }

    public getNOfJobCategories(): number {
        return new Set(this.workers?.map((worker) => worker.name)).size;
    }

    public getNOfWorkersBelowLW(): number {
        return this.workers?.filter((w) => w.isBelowLW()).length;
    }

    public getNOfWorkers(): number {
        return this.workers?.reduce((counter, worker) => worker.numberOfWorkers + counter, 0) ?? 0;
    }
    public calculcateLwGaps(): void {
        if (!this.workers.length) {
            return;
        }

        const benchmarkValue = this.benchmark.localValue ?? 0;
        const lwGaps = this.workers
            ?.map((worker) => worker.getTotalRenumeration())
            .filter((value) => value < benchmarkValue)
            .map((value) => benchmarkValue - value);

        const avg = lwGaps?.reduce((counter, value) => value + counter, 0) ?? 0;
        const largest = [...lwGaps].sort().at(lwGaps.length - 1) ?? 0;

        this.averageLwGap = avg;
        this.largestLwGap = largest;
    }
}
