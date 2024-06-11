import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class SimulationBenchmark {
    @Property({ nullable: true, default: null })
    name?: string;

    @Property({ length: 4, nullable: true, default: null })
    year?: number;

    @Property({ length: 100, nullable: true, default: null })
    source?: string;

    @Property({ length: 50, nullable: true, default: null })
    locality?: string;

    @Property({ length: 50, nullable: true, default: null })
    region?: string;

    @Property({ length: 3, nullable: true, default: null })
    currencyCode?: string;

    @Property({ length: 100, nullable: true, default: null })
    currencyName?: string;

    @Property({ columnType: 'numeric(19,4)', nullable: true, default: null })
    localValue?: number;

    constructor(props: {
        name?: string;
        year?: number;
        source?: string;
        locality?: string;
        region?: string;
        currencyCode?: string;
        currencyName?: string;
        localValue?: number;
    }) {
        this.name = props.name;
        this.year = props.year;
        this.source = props.source;
        this.locality = props.locality;
        this.region = props.region;

        this.currencyCode = props.currencyCode;
        this.currencyName = props.currencyName;
        this.localValue = props.localValue;
    }
}
