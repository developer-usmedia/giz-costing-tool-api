import { Embeddable, Property } from '@mikro-orm/core';

// TODO: think again on the database types and limitation

@Embeddable()
export class Benchmark {
    @Property({ length: 100 })
    name!: string;

    @Property({ length: 4 })
    year!: number;

    @Property({ length: 100 })
    source!: string;

    @Property({ length: 50 })
    locality!: string;

    @Property({ length: 50, nullable: true })
    region?: string;

    @Property({ columnType: 'numeric' })
    lcuValue!: number;

    constructor(props: { name: string; year: number; source: string; locality: string; lcuValue: number; region?: string }) {
        this.name = props.name;
        this.source = props.source;
        this.year = props.year;
        this.locality = props.locality;
        this.lcuValue = props.lcuValue;
        this.region = props.region;
    }
}
