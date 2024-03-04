import { Embeddable, Property } from '@mikro-orm/core';


@Embeddable()
export class SimulationFacility {
    @Property({ length: 100 })
    name!: string;

    @Property({ nullable: true })
    id?: string; // When imported from Salary Matrix tool

    @Property({ length: 2 })
    countryCode!: string;

    @Property({ length: 3 })
    currencyCode!: string;

    @Property({ length: 100, nullable: true })
    sector?: string;

    @Property({ length: 255 })
    product!: string;

    @Property({ length: 50 })
    unitOfProduction!: string;

    @Property({ columnType: 'numeric(19,4)', unsigned: true })
    annualProduction!: number;

    constructor(props: {
        name: string;
        id: string;
        countryCode: string;
        currencyCode: string;
        sector: string;
        product: string;
        unitOfProduction: string;
        annualProduction: number;
    }) {
        this.name = props.name;
        this.id = props.id;
        this.countryCode = props.countryCode;
        this.currencyCode = props.currencyCode;
        this.sector = props.sector;
        this.product = props.product;
        this.unitOfProduction = props.unitOfProduction;
        this.annualProduction = props.annualProduction;
    }
}
