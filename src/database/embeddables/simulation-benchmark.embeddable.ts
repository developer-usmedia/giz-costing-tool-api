import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class SimulationBenchmark {
    @Property({ length: 4 })
    year!: number;

    @Property({ length: 100, nullable: true })
    source?: string;

    @Property({ length: 50, nullable: true })
    locality?: string;

    @Property({ length: 50, nullable: true })
    region?: string;

    @Property({ length: 3 })
    currencyCode!: string; 

    @Property({ length: 100 })
    currencyName!: string;

    @Property({ columnType: 'numeric(19,4)' })
    localValue!: number;

    constructor(props: {
        year: number;
        source?: string;
        locality?: string;
        region?: string;
        currencyCode: string;
        currencyName: string;
        localValue: number;
    }) {
        this.year = props.year;
        this.source = props.source;
        this.locality = props.locality;
        this.region = props.region;

        this.currencyCode = props.currencyCode;
        this.currencyName = props.currencyName;
        this.localValue = props.localValue;
    }
}
