import { Embeddable, Property } from '@mikro-orm/core';
import { customAlphabet } from 'nanoid';

const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const CODE_TTL_HOURS = 1;
const generateBasicCode = customAlphabet(CODE_ALPHABET, 6);

@Embeddable()
export class VerificationCode {
    @Property({ length: 6, nullable: true })
    code?: string;

    @Property({ nullable: true })
    expiresAt?: Date;

    constructor() {
        this.code = generateBasicCode();
        this.expiresAt = new Date(this.generateNewDate());
    }

    public isExpired(): boolean {
        const now = new Date();

        return now > this.expiresAt;
    }

    public verify(code: string): boolean {
        return !this.isExpired() && this.code === code;
    }

    public generateNewDate(): number {
        const now = new Date();

        return now.setHours(now.getHours() + CODE_TTL_HOURS);
    }
}
