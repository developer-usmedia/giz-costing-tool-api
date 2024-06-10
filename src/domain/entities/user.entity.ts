import { Embedded, Entity, Property, Unique } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

import { TwoFactor } from '@domain/embeddables/two-factor.embed';
import { VerificationCode } from '@domain/embeddables/verification-code.embed';
import { AbstractEntity } from '@domain/entities/base/abstract.entity';
import { Guard, GuardRegex } from '@domain/utils/guard';

@Entity()
export class User extends AbstractEntity<User> {
    @Property({ unique: true })
    @Unique()
    private _email: string;

    @Property({ hidden: true })
    private _password: string;

    @Property()
    private _salt: string;

    @Property({ default: false })
    private _emailVerified: boolean;

    @Embedded({ entity: () => VerificationCode, prefix: 'verification_', nullable: true })
    private _verificationCode: VerificationCode;

    @Embedded({ entity: () => TwoFactor, prefix: 'twofactor_', nullable: true })
    private _twoFactor: TwoFactor;

    @Property({ columnType: 'varchar(400)', nullable: true })
    private _refreshToken: string;

    constructor(props: { email: string; password: string }) {
        super();

        this.email = props.email;

        this.salt = this.generateSalt();
        this.password = this.hashPassword(props.password, this.salt);
        this.verificationCode = new VerificationCode();
    }

    get email() {
        return this._email;
    }
    get password() {
        return this._password;
    }
    get salt() {
        return this._salt;
    }
    get emailVerified() {
        return this._emailVerified;
    }
    get verificationCode() {
        return this._verificationCode;
    }
    get twoFactor() {
        return this._twoFactor;
    }
    get refreshToken() {
        return this._refreshToken;
    }

    set email(value: string) {
        Guard.check(value, { type: 'string', regex: GuardRegex.EMAIL });
        this._email = value;
    }

    set password(value: string) {
        Guard.check(value, { type: 'string' });
        if (!this.salt) {
            throw new Error('[User] No salt');
        }
        this._password = this.hashPassword(value, this.salt);
    }

    set salt(value: string) {
        Guard.check(value, { type: 'string' });
        this._salt = value;
    }

    set emailVerified(value: boolean) {
        Guard.check(value, { type: 'boolean' });
        this._emailVerified = value;
    }

    set verificationCode(value: VerificationCode) {
        Guard.check(value, { type: 'object', optional: true });
        this._verificationCode = value;
    }

    set twoFactor(value: TwoFactor) {
        Guard.check(value, { type: 'object' });
        this._twoFactor = value;
    }

    set refreshToken(value: string) {
        Guard.check(value, { type: 'string', optional: true, allowEmpty: true });
        this._refreshToken = value;
    }

    public comparePasswords(password: string): boolean {
        return bcrypt.compareSync(this.hashPassword(password, this.salt), this.password);
    }

    public verifyCode(code: string) {
        return this.verificationCode.verify(code);
    }

    public refreshVerificationCode() {
        this.verificationCode = new VerificationCode();
    }

    public resetPassword(newPassword: string): boolean {
        const hashedPassword = this.hashPassword(newPassword, this.salt);

        this.password = hashedPassword;
        this.verificationCode = new VerificationCode();

        return true;
    }

    public enable2FA() {
        this.twoFactor.enabled = true;
    }

    public disable2FA() {
        this.twoFactor.enabled = false;
    }

    public set2FASecret(secret: string) {
        this.twoFactor.secret = secret;
    }

    private hashPassword(password: string, salt: string): string {
        return bcrypt.hashSync(password, salt);
    }

    private generateSalt(): string {
        return bcrypt.genSaltSync(10);
    }
}
