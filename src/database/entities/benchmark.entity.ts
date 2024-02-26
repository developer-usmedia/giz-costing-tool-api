import { Entity, Property } from '@mikro-orm/core';

import { AbstractEntity } from './base/abstract.entity';

@Entity()
export class Benchmark extends AbstractEntity<Benchmark> {
    @Property({ length: 4 })
    year!: number;

    @Property({ length: 100, nullable: true })
    source?: string;

    @Property({ length: 3 })
    countryCode!: string; // BD / AR

    @Property({ nullable: false })
    countryName!: string;   // Bangladesh / Argentina

    @Property({ length: 50 })
    countryLocality!: string; // Rural / Urban

    @Property({ length: 100, nullable: true }) 
    countryRegion?: string; // Dhaka City

    @Property({ length: 3 }) 
    currencyCode!: string; // ARS / EUR

    @Property({ length: 50 })
    currencyName!: string;  // Bangladeshi Taki / Argentine Peso

    @Property({ columnType: 'numeric(19,4)' })
    localValue!: number;

    @Property({ columnType: 'numeric(19,4)', nullable: true })
    eurValue?: number;

    @Property({ columnType: 'numeric(19,4)', nullable: true })
    usdValue?: number;

    constructor(props: {
        year: number;
        source: string;
        countryCode: string;
        countryName: string;
        countryLocality: string;
        countryRegion?: string;
        currencyCode: string;
        currencyName?: string;
        localValue: number;
        eurValue?: number;
        usdValue?: number;
    }) {
        super();

        this.year = props.year;
        this.source = props.source;

        this.countryCode = props.countryCode;
        this.countryName = props.countryName;
        this.countryLocality = props.countryLocality;
        this.countryRegion = props.countryRegion;

        this.currencyCode = props.currencyCode;
        this.currencyName = props.currencyName;
        this.localValue = props.localValue;
        this.eurValue = props.eurValue;
        this.usdValue = props.usdValue;
    }
}
