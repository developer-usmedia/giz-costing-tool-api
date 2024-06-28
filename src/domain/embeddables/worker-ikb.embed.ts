import { Embeddable, Property } from '@mikro-orm/core';

/* Values for these properties are in LCU (local currency unit) and are not percentages */

@Embeddable()
export class WorkerIKB {
    @Property({ columnType: 'numeric(12,4)', unsigned: true })
    ikbFood?: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true })
    ikbTransportation?: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true })
    ikbHousing?: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true })
    ikbHealthcare?: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true })
    ikbChildcare?: number;

    @Property({ columnType: 'numeric(12,4)', unsigned: true })
    ikbChildEducation?: number;

    constructor(props: {
        ikbFood?: number;
        ikbTransportation?: number;
        ikbHousing?: number;
        ikbHealthcare?: number;
        ikbChildcare?: number;
        ikbChildEducation?: number;
    }) {
        this.ikbFood = props.ikbFood ?? 0;
        this.ikbTransportation = props.ikbTransportation ?? 0;
        this.ikbHousing = props.ikbHousing ?? 0;
        this.ikbHealthcare = props.ikbHealthcare ?? 0;
        this.ikbChildcare = props.ikbChildcare ?? 0;
        this.ikbChildEducation = props.ikbChildEducation ?? 0;
    }

    get sumAll(): number {
        return this.ikbFood + 
                this.ikbTransportation + 
                this.ikbHousing + 
                this.ikbHealthcare + 
                this.ikbChildcare + 
                this.ikbChildEducation;
    }
}
