import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class EntryFacility {
    @Property({ length: 100 })
    name: string;

    @Property({ nullable: true })
    id?: string; // When imported from Salary Matrix tool

    @Property({ nullable: true })
    country: string;

    @Property({ length: 3, nullable: true })
    countryCode?: string;

    @Property({ length: 3, nullable: true, default: null })
    currencyCode?: string;

    @Property({ length: 255, nullable: true, default: null })
    product?: string;

    @Property({ length: 50, nullable: true, default: null })
    unitOfProduction?: string;

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true, default: null })
    annualProduction?: number;

    @Property({ nullable: true, default: null })
    buyerName?: string;

    @Property({ nullable: true, unsigned: true, default: null })
    buyerProportion?: number;

    // TODO: add a buyerProportionUnit

    constructor(props: {
        name: string;
        countryCode?: string;
        country: string;
        id?: string;
        currencyCode?: string;
        product?: string;
        unitOfProduction?: string;
        annualProduction?: number;
    }) {
        this.name = props.name;
        this.country = props.country;

        this.id = props.id;
        this.currencyCode = props.currencyCode;
        this.countryCode = props.countryCode;
        this.product = props.product;
        this.unitOfProduction = props.unitOfProduction;
        this.annualProduction = props.annualProduction;
    }
}
