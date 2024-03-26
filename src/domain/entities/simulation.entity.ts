import { Collection, Embedded, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { SimulationBenchmark } from '@domain/embeddables/simulation-benchmark.embed';
import { SimulationFacility } from '@domain/embeddables/simulation-facility.embed';
import { AbstractEntity } from '@domain/entities/base/abstract.entity';
import { User } from '@domain/entities/user.entity';
import { Worker } from '@domain/entities/worker.entity';
import { SimulationStatus } from '@domain/enums/simulation-status.enum';
import { Guard } from '@domain/utils/guard';

@Entity()
export class Simulation extends AbstractEntity<Simulation> {
    @Property()
    private _year: number;

    @ManyToOne(() => User, { deleteRule: 'cascade', eager: true })
    private _user: User;

    @Enum({ items: () => SimulationStatus, default: SimulationStatus.OPEN })
    private _status: SimulationStatus;

    @Embedded({ entity: () => SimulationFacility, prefix: 'facility_' })
    private _facility: SimulationFacility;

    @Embedded({ entity: () => SimulationBenchmark, prefix: 'benchmark_' })
    private _benchmark: SimulationBenchmark;

    // eslint-disable-next-line @typescript-eslint/dot-notation
    @OneToMany({ entity: () => Worker, mappedBy: (worker) => worker['_simulation'], nullable: true })
    private readonly _workers? = new Collection<Worker>(this);

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: 0 })
    private _defaultEmployerTax?: number; //  Percentage (0 - 100)

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: 0 })
    private _defaultEmployeeTax?: number; // Percentage (0 - 100)

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: 0 })
    private _administrativeCosts: number;

    constructor(props: {
        year: number;
        user: User;
        facility: SimulationFacility;
        status?: SimulationStatus;
        benchmark?: SimulationBenchmark;
    }) {
        super();
        this.year = props.year;
        this.user = props.user;
        this.facility = props.facility;

        this.status = props.status ?? SimulationStatus.OPEN;
        this.benchmark = props.benchmark ?? new SimulationBenchmark({});
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

    set year(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999 });
        this._year = value;
    }

    set user(value: User) {
        Guard.check(value, { type: 'object' });
        this._user = value;
    }

    set facility(value: SimulationFacility) {
        Guard.check(value, { type: 'object' });
        this._facility = value;
    }

    set status(value: SimulationStatus) {
        Guard.check(value, { type: 'string' });
        if (!Object.values(SimulationStatus).includes(value)) {
            throw new Error(`Status (${value}} is not a SimulationStatus`);
        }
        this._status = value;
    }

    set benchmark(value: SimulationBenchmark) {
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
}
