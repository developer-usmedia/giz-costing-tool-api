import { Entity, Property } from '@mikro-orm/core';

import { AbstractEntity } from './base/abstract.entity';

@Entity()
export class Benchmark extends AbstractEntity<Benchmark> {
    @Property({ length: 4 })
    year!: number;

    @Property({ length: 100, nullable: true })
    source?: string;

    @Property({ length: 3 })
    countryCode!: string;

    @Property({ nullable: false })
    countryName!: string;

    @Property({ length: 50 })
    countryLocality!: string;

    @Property({ length: 100, nullable: true })
    countryRegion?: string;

    @Property({ length: 3 })
    currencyCode!: string;

    @Property({ length: 100 })
    currencyName!: string;

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
