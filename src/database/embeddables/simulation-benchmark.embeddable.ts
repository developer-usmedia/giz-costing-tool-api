import { Embeddable, Property } from '@mikro-orm/core';

// TODO: think again on the database types and limitation

@Embeddable()
export class SimulationBenchmark {
    @Property({ length: 4 })
    year!: number;

    @Property({ length: 100, nullable: true })
    source?: string;

    @Property({ length: 50, nullable: true })
    locality?: string; // Rural / Urban

    @Property({ length: 50, nullable: true })
    region?: string; // Dhaka City

    @Property({ length: 3 })
    currencyCode!: string; // ARS / EUR

    @Property({ length: 50 })
    currencyName!: string; // Bangladeshi Taki / Argentine Peso

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
