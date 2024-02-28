import { generateBasicToken } from '@common/utils/generateBasicToken';
import { Embeddable, Property } from '@mikro-orm/core';

const CODE_TTL_HOURS = 1;

@Embeddable()
export class VerificationCode {
    @Property({ length: 6, nullable: true })
    code?: string;

    @Property({ nullable: true })
    expiresAt?: Date;

    constructor() {
        this.code = generateBasicToken();
        this.expiresAt = new Date(this.generateNewDate());
    }

    public reset() {
        this.code = null;
        this.expiresAt = null;
    }

    public isExpired(): boolean {
        const now = new Date();

        return now > this.expiresAt;
    }

    public verifyCode(code: string): boolean {
        return !this.isExpired() && this.code === code;
    }

    public generateNewDate(): number {
        const now = new Date();

        return now.setHours(now.getHours() + CODE_TTL_HOURS);
    }
}
