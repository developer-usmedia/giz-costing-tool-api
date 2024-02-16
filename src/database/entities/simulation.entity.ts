import { Embedded, Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { SimulationStatus } from '@common/enums/simulation-status.enum';
import { Benchmark } from '@database/embeddables/benchmark.embeddable';
import { Facility } from '@database/embeddables/facility.embeddable';
import { AbstractEntity } from './base/abstract.entity';
import { User } from './user.entity';

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

    @Embedded({ entity: () => Facility, prefix: 'facility_', nullable: true })
    facility!: Facility;

    @Embedded({ entity: () => Benchmark, prefix: 'benchmark_', nullable: true })
    benchmark!: Benchmark;

    constructor(props: { name: string; year: number; user: User }) {
        super();

        this.name = props.name;
        this.year = props.year;
        this.user = props.user;
    }
}
