import { Entity, Property } from '@mikro-orm/core';

import { AbstractEntity } from '@domain/entities';
import { Guard, GuardRegex } from '@domain/utils/guard';

export interface BenchmarkProps {
    source: string;
    year: number;
    countryCode: string;
    locality: string;
    region: string;
    currencyCode: string;
    localValue: number;
    eurValue: number;
    usdValue: number;
}

@Entity()
export class Benchmark extends AbstractEntity<Benchmark> {
    @Property()
    private _source: string;

    @Property({ columnType: 'smallint', length: 4, unsigned: true })
    private _year: number;

    @Property({ length: 2 })
    private _countryCode: string;

    @Property()
    private _locality: string;

    @Property()
    private _region: string;

    @Property({ length: 3 })
    private _currencyCode: string;

    @Property({ columnType: 'numeric(12,2)', unsigned: true })
    private _localValue: number;

    @Property({ columnType: 'numeric(12,2)', unsigned: true })
    private _eurValue: number;

    @Property({ columnType: 'numeric(12,2)', unsigned: true })
    private _usdValue: number;

    constructor(props: BenchmarkProps) {
        super();

        this.source = props.source;
        this.year = props.year;
        this.countryCode = props.countryCode;
        this.locality = props.locality;
        this.region = props.region;

        this.currencyCode = props.currencyCode;
        this.localValue = props.localValue;
        this.eurValue = props.eurValue;
        this.usdValue = props.usdValue;
    }

    get source() {
        return this._source;
    }

    get year() {
        return this._year;
    }

    get countryCode() {
        return this._countryCode;
    }

    get locality() {
        return this._locality;
    }

    get region() {
        return this._region;
    }

    get currencyCode() {
        return this._currencyCode;
    }

    get localValue() {
        return this._localValue;
    }

    get eurValue() {
        return this._eurValue;
    }

    get usdValue() {
        return this._usdValue;
    }

    set source(value: string) {
        Guard.check(value, { type: 'string' });
        this._source = value;
    }

    set year(value: number) {
        Guard.check(value, { type: 'number', min: 2020, max: 2050 });
        this._year = value;
    }

    set countryCode(value: string) {
        Guard.check(value, { type: 'string', minLength: 2, maxLength: 3 });
        this._countryCode = value;
    }

    set locality(value: string) {
        Guard.check(value, { type: 'string' });
        this._locality = value;
    }

    set region(value: string) {
        Guard.check(value, { type: 'string' });
        this._region = value;
    }

    set currencyCode(value: string) {
        Guard.check(value, { type: 'string', regex: GuardRegex.CURRENCY_CODE });
        this._currencyCode = value;
    }

    set localValue(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._localValue = value;
    }

    set eurValue(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._eurValue = value;
    }

    set usdValue(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999999999.99 });
        this._usdValue = value;
    }
}
