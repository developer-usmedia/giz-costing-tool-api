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
}
