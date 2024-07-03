import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class TwoFactor {
    @Property({ default: false })
    enabled!: boolean;

    @Property({ nullable: true })
    secret?: string;
}
