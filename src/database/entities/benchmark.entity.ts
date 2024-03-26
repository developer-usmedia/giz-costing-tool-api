import { Entity, Property } from '@mikro-orm/core';

import { AbstractEntity } from './base/abstract.entity';
import { Guard, GuardRegex } from '@common/utils/guard';

@Entity()
export class Benchmark extends AbstractEntity<Benchmark> {
    @Property({ length: 4 })
    private _year: number;

    @Property({ length: 3 })
    private _countryCode: string;

    @Property({ nullable: false })
    private _countryName: string;

    @Property({ length: 50 })
    private _countryLocality: string;

    @Property({ length: 100, nullable: true })
    private _countryRegion?: string;

    @Property({ length: 3 })
    private _currencyCode: string;

    @Property({ length: 100 })
    private _currencyName: string;

    @Property({ columnType: 'numeric(19,4)' })
    private _localValue: number;

    @Property({ columnType: 'numeric(19,4)', nullable: true })
    private _eurValue?: number;

    @Property({ columnType: 'numeric(19,4)', nullable: true })
    private _usdValue?: number;

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

    get year() {
        return this._year;
    }
    get countryCode() {
        return this._countryCode;
    }
    get countryName() {
        return this._countryName;
    }
    get countryLocality() {
        return this._countryLocality;
    }
    get countryRegion() {
        return this._countryRegion;
    }
    get currencyCode() {
        return this._currencyCode;
    }
    get currencyName() {
        return this._currencyName;
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

    set year(value: number) {
        Guard.check(value, { type: 'number', min: 0, max: 9999 });
        this._year = value;
    }

    set countryCode(value: string) {
        Guard.check(value, { type: 'string', minLength: 2, maxLength: 3 });
        this._countryCode = value;
    }

    set countryName(value: string) {
        Guard.check(value, { type: 'string' });
        this._countryName = value;
    }

    set countryLocality(value: string) {
        Guard.check(value, { type: 'string' });
        this._countryLocality = value;
    }

    set countryRegion(value: string) {
        Guard.check(value, { type: 'string' });
        this._countryRegion = value;
    }

    set currencyCode(value: string) {
        Guard.check(value, { type: 'string', regex: GuardRegex.CURRENCY_CODE });
        this._currencyCode = value;
    }

    set currencyName(value: string) {
        Guard.check(value, { type: 'string' });
        this._currencyName = value;
    }

    set localValue(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._localValue = value;
    }

    set eurValue(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._eurValue = value;
    }

    set usdValue(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._usdValue = value;
    }
}
