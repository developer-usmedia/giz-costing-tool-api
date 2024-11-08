import { Embeddable, Property } from '@mikro-orm/core';

import { Guard } from '@domain/utils/guard';

export interface EntryFacilityProps {
    name: string;
    countryCode: string;
    facilityId?: string;
    products?: string;
    productionUnit?: string;
    productionAmount?: number;
}

@Embeddable()
export class EntryFacility {
    @Property()
    private _name: string;

    @Property({ length: 2, fieldName: 'country_code' })
    private _countryCode: string;

    @Property({ nullable: true, fieldName: 'id' })
    private _facilityId?: string; // Facility ID - Known when imported from Salary Matrix tool

    @Property({ nullable: true })
    private _products?: string;

    @Property({ nullable: true, fieldName: 'production_unit' })
    private _productionUnit?: string;

    @Property({ columnType: 'numeric(15,2)', unsigned: true, nullable: true, fieldName: 'production_amount' })
    private _productionAmount?: number;

    constructor(props: EntryFacilityProps) {
        this.name = props.name;
        this.countryCode = props.countryCode;

        this.facilityId = props.facilityId ?? null;
        this.products = props.products ?? null;
        this.productionUnit = props.productionUnit ?? null;
        this.productionAmount = props.productionAmount ?? null;
    }

    get name() {
        return this._name;
    }

    get countryCode() {
        return this._countryCode;
    }

    get facilityId() {
        return this._facilityId ?? null;
    }

    get products() {
        return this._products ?? null;
    }

    get productionUnit() {
        return this._productionUnit ?? null;
    }

    get productionAmount() {
        return this._productionAmount ?? null;
    }

    private set name(value: string) {
        Guard.check(value, { type: 'string' });
        this._name = value;
    }

    private set countryCode(value: string) {
        Guard.check(value, { type: 'string', optional: true, maxLength: 2, minLength: 2 });
        this._countryCode = value;
    }

    private set facilityId(value: string) {
        Guard.check(value, { type: 'string', optional: true, minLength: 3 });
        this._facilityId = value;
    }

    private set products(value: string) {
        Guard.check(value, { type: 'string', optional: true, minLength: 3 });
        this._products = value;
    }

    private set productionUnit(value: string) {
        Guard.check(value, { type: 'string', optional: true, minLength: 3 });
        this._productionUnit = value;
    }

    private set productionAmount(value: number) {
        Guard.check(value, { type: 'number', optional: true, min: 0, max: 9999999999999.99 });
        this._productionAmount = value;
    }

    public isComplete(): boolean {
        return !!this._productionAmount
            && !!this._productionUnit
            && !!this._name
            && !!this._countryCode;
    }
}
