import { Embeddable, Property } from '@mikro-orm/core';

import { Guard } from '@domain/utils/guard';

// TODO: Force source
export interface EntryBenchmarkProps {
    name: string;
    country: string;
    year: number;
    source?: string;
    region: string;
    locality?: string;
    value: number;
}

@Embeddable()
export class EntryBenchmark {
    // TODO: Replace with countryCode when possible
    @Property({ nullable: true })
    private _country?: string;

    // @Property({ length: 2, fieldName: 'country_code' })
    // private _countryCode?: string;

    @Property({ nullable: true })
    private _name?: string;

    @Property({ columnType: 'smallint', length: 4, unsigned: true, nullable: true })
    private _year?: number;

    @Property({ nullable: true })
    private _source?: string;

    @Property({ nullable: true })
    private _region?: string;

    @Property({ nullable: true })
    private _locality?: string;

    @Property({ columnType: 'numeric(12,2)', unsigned: true, nullable: true })
    private _value?: number;

    constructor(props?: EntryBenchmarkProps) {
        if (props) {
            this.name = props.name;
            this.country = props.country;
            this.year = props.year;
            this.source = props.source ?? null;
            this.region = props.region;
            this.locality = props.locality ?? null;
            this.value = props.value;
        }
    }


    get name() {
        return this._name ?? null;
    }

    get country() {
        return this._country ?? null;
    }

    // get countryCode() {
    //     return this._countryCode ?? null;
    // }

    get year() {
        return this._year ?? null;
    }

    get source() {
        return this._source ?? null;
    }

    get region() {
        return this._region ?? null;
    }


    get locality() {
        return this._locality ?? null;
    }

    get value() {
        return this._value ?? null;
    }


    private set name(value: string) {
        Guard.check(value, { type: 'string', optional: true });
        this._name = value;
    }

    private set country(value: string) {
        Guard.check(value, { type: 'string', optional: true, minLength: 3 });
        this._country = value;
    }

    // private set countryCode(value: string) {
    //     Guard.check(value, { type: 'string', optional: true, maxLength: 2, minLength: 2 });
    //     this._countryCode = value;
    // }

    private set year(value: number) {
        Guard.check(value, { type: 'number', optional: true, min: 2000, max: 2100 });
        this._year = value;
    }

    private set source(value: string) {
        Guard.check(value, { type: 'string', optional: true, minLength: 3 });
        this._source = value;
    }

    private set region(value: string) {
        Guard.check(value, { type: 'string', optional: true, minLength: 3 });
        this._region = value;
    }

    private set locality(value: string) {
        Guard.check(value, { type: 'string', optional: true, minLength: 3 });
        this._locality = value;
    }

    private set value(value: number) {
        Guard.check(value, { type: 'number', optional: true, min: 1, max: 9999999999.99 });
        this._value = value;
    }

    public isComplete(): boolean {
        // Replace country with countryCode when possible
        return !!this._value
            && !!this._country
            && !!this._year
            && !!this._region;
            // && !!this._source; // Renable when required
    }
}
