import { Embeddable, Property } from '@mikro-orm/core';

/* Values for these properties are in LCU (local currency unit) and are not percentages */

@Embeddable()
export class WorkerIKB {
    @Property({ default: 0, columnType: 'numeric(19,4)', nullable: true })
    ikbFood?: number;

    @Property({ default: 0, columnType: 'numeric(19,4)', nullable: true })
    ikbTransportation?: number;

    @Property({ default: 0, columnType: 'numeric(19,4)', nullable: true })
    ikbHousing?: number;

    @Property({ default: 0, columnType: 'numeric(19,4)', nullable: true })
    ikbHealthcare?: number;

    @Property({ default: 0, columnType: 'numeric(19,4)', nullable: true })
    ikbChildcare?: number;

    constructor(props: {
        ikbFood?: number;
        ikbTransportation?: number;
        ikbHousing?: number;
        ikbHealthcare?: number;
        ikbChildcare?: number;
    }) {
        this.ikbFood = props.ikbFood ?? 0;
        this.ikbTransportation = props.ikbTransportation ?? 0;
        this.ikbHousing = props.ikbHousing ?? 0;
        this.ikbChildcare = props.ikbChildcare ?? 0;
        this.ikbHealthcare = props.ikbHealthcare ?? 0;
    }

    public getTotal(): number {
        return this.ikbFood + 
                this.ikbTransportation + 
                this.ikbHousing + 
                this.ikbHealthcare + 
                this.ikbChildcare;
    }
}
