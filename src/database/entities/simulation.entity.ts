import { Collection, Embedded, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { SimulationStatus } from '@common/enums/simulation-status.enum';
import { SimulationBenchmark } from '@database/embeddables/simulation-benchmark.embeddable';
import { SimulationFacility } from '@database/embeddables/simulation-facility.embeddable';
import { AbstractEntity } from './base/abstract.entity';
import { User } from './user.entity';
import { Worker } from './worker.entity';

@Entity()
export class Simulation extends AbstractEntity<Simulation> {
    @Property()
    year: number;

    @ManyToOne(() => User, { deleteRule: 'cascade' })
    user: User;

    @Enum({ items: () => SimulationStatus, default: SimulationStatus.OPEN })
    status: SimulationStatus;

    @Embedded({ entity: () => SimulationFacility, prefix: 'facility_' })
    facility: SimulationFacility;

    @Embedded({ entity: () => SimulationBenchmark, prefix: 'benchmark_' })
    benchmark: SimulationBenchmark;

    @OneToMany({ entity: () => Worker, mappedBy: (worker) => worker.simulation, nullable: true })
    workers? = new Collection<Worker>(this);

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: 0 })
    defaultEmployerTax?: number; //  Percentage (0 - 100)

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: 0 })
    defaultEmployeeTax?: number; // Percentage (0 - 100)

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: 0 })
    administrativeCosts: number;

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

        this.status = props.status;
        this.benchmark = props.benchmark ?? new SimulationBenchmark({});
        this.workers = null;
    }
}
