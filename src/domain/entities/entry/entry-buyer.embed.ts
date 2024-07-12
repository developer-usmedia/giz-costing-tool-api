import { Embeddable, Enum, Property } from '@mikro-orm/core';

import { BUYER_UNIT_OPTIONS, BuyerUnit } from '@domain/entities';
import { Guard } from '@domain/utils/guard';

export interface EntryBuyerProps {
    name: string;
    proportionUnit: BuyerUnit;
    proportionAmount: number;
}

@Embeddable()
export class EntryBuyer {
    @Property({ nullable: true })
    private _name?: string;

    @Enum({ items: () => BUYER_UNIT_OPTIONS, nullable: true })
    private _unit?: BuyerUnit;

    @Property({ columnType: 'numeric(9,2)', unsigned: true, nullable: true })
    private _amount?: number;

    constructor(props?: EntryBuyerProps) {
        if (props) {
            this.name = props.name;
            this.unit = props.proportionUnit;
            this.amount = props.proportionAmount;
        }
    }

    get name() {
        return this._name ?? null;
    }

    get unit() {
        return this._unit ?? null;
    }

    get amount() {
        return this._amount ?? null;
    }

    private set name(value: string) {
        Guard.check(value, { type: 'string', optional: true });
        this._name = value;
    }

    private set unit(value: BuyerUnit) {
        Guard.check(value, { type: 'string', options: BUYER_UNIT_OPTIONS });
        this._unit = value;
    }

    private set amount(value: number) {
        if(this.unit === 'PERCENTAGE') {
            Guard.check(value, { type: 'number', optional: true, min: 0, max: 100 });
        } else {
            Guard.check(value, { type: 'number', optional: true, min: 1, max: 9999999.99 });
        }

        this._amount = value;
    }

    public isComplete(): boolean {
        return !!this._name
            && !!this._unit
            && !!this._amount;
    }
}
