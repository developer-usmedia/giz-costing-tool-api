import { Entity, Property } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

import { generateBasicToken } from '@common/utils/generateBasicToken';
import { IsOptional } from 'class-validator';
import { AbstractEntity } from './base/abstract.entity';

@Entity()
export class User extends AbstractEntity<User> {
    @Property({ nullable: true })
    firstName?: string;

    @Property({ nullable: true })
    lastName?: string;

    @Property({ unique: true })
    email!: string;

    @Property({
        hidden: true, // Keeps it from .toObject() and .toJSON()
        lazy: true, // Requires dev to specifically ask for the property
    })
    password!: string;

    @Property()
    salt!: string;

    @Property({ nullable: true })
    @IsOptional()
    resetToken?: string;

    @Property({ nullable: true })
    @IsOptional()
    resetTokenExpire?: Date;

    // TODO: Think of doing salt & hasing using hooks?
    // https://mikro-orm.io/docs/guide/relationships#:~:text=()%0A%20%20async-,hashPassword,-(args%3A
    constructor(props: { email: string; password: string; firstName?: string; lastName?: string }) {
        super();

        this.email = props.email;
        this.firstName = props.firstName;
        this.firstName = props.lastName;
        this.salt = this.generateSalt();
        this.password = this.hashPassword(props.password, this.salt);
    }

    public comparePasswords(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

    public compareResetToken(token: string) {
        const match = token === this.resetToken;
        const expired = new Date(this.resetTokenExpire).getTime() < new Date().getTime();

        return match && !expired;
    }

    public resetPassword(newPassword: string): boolean {
        const hashedPassword = this.hashPassword(newPassword, this.salt);

        this.password = hashedPassword;
        this.resetToken = null;
        this.resetTokenExpire = null;

        return true;
    }

    public generateAndSetResetToken(): string {
        this.resetToken = generateBasicToken();
        this.resetTokenExpire = new Date(Date.now() + 3600000); // 1hr

        return this.resetToken;
    }

    private hashPassword(password: string, salt: string): string {
        return bcrypt.hashSync(password, salt);
    }

    private generateSalt(): string {
        return bcrypt.genSaltSync(10);
    }
}
