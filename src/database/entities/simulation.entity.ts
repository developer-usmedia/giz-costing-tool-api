import { Collection, Embedded, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { SimulationStatus } from '@common/enums/simulation-status.enum';
import { SimulationBenchmark } from '@database/embeddables/simulation-benchmark.embeddable';
import { SimulationFacility } from '@database/embeddables/simulation-facility.embeddable';
import { AbstractEntity } from './base/abstract.entity';
import { User } from './user.entity';
import { Worker } from './worker.entity';

@Entity()
export class Simulation extends AbstractEntity<Simulation> {
    @Property({ length: 100 })
    name!: string;

    @Property()
    year!: number;

    @ManyToOne(() => User)
    user!: User;

    @Enum({ items: () => SimulationStatus, default: SimulationStatus.OPEN })
    status!: SimulationStatus;

    @Embedded({ entity: () => SimulationFacility, prefix: 'facility_', nullable: true })
    facility!: SimulationFacility;

    @Embedded({ entity: () => SimulationBenchmark, prefix: 'benchmark_', nullable: true })
    benchmark!: SimulationBenchmark;

    @OneToMany({ entity: () => Worker, mappedBy: (worker) => worker.simulation, nullable: true })
    workers? = new Collection<Worker>(this);

    constructor(props: {
        name: string;
        year: number;
        user: User;
        status?: SimulationStatus;
        facility?: SimulationFacility;
        benchmark?: SimulationBenchmark;
    }) {
        super();

        this.name = props.name;
        this.year = props.year;
        this.user = props.user;
        this.status = props.status;
        this.facility = props.facility;
        this.benchmark = props.benchmark;

        this.workers = null;
    }
}
