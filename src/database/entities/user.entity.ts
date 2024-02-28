import { Collection, Embedded, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

import { VerificationCode } from '@database/embeddables/verification-code.embeddable';
import { AbstractEntity } from './base/abstract.entity';
import { Simulation } from './simulation.entity';

@Entity()
export class User extends AbstractEntity<User> {
    @Property({ unique: true })
    @Unique()
    email!: string;

    @Property({ nullable: true })
    firstName?: string;

    @Property({ nullable: true })
    lastName?: string;

    @Property({
        hidden: true, // Keeps it from .toObject() and .toJSON()
        lazy: true, // Requires dev to specifically ask for the property
    })
    password!: string;

    @Property()
    salt!: string;

    @Property({ default: false })
    emailVerfied!: boolean;

    @Embedded({ entity: () => VerificationCode, prefix: 'verification_', nullable: true })
    verificationCode!: VerificationCode;

    @OneToMany({ entity: () => Simulation, mappedBy: (simulation) => simulation.user, nullable: true })
    simulations? = new Collection<Simulation>(this);

    constructor(props: { email: string; password: string; firstName?: string; lastName?: string }) {
        super();

        this.email = props.email;
        this.firstName = props.firstName;
        this.firstName = props.lastName;
        this.salt = this.generateSalt();
        this.password = this.hashPassword(props.password, this.salt);
        this.verificationCode = new VerificationCode();

        this.simulations = null;
    }

    public comparePasswords(password: string): boolean {
        if (!this.password) {
            throw new Error('Please remember to populate the password field when fetching the user from the database');
        }

        return bcrypt.compareSync(password, this.password);
    }

    public verifyCode(code: string) {
        return this.verificationCode.verifyCode(code);
    }

    public refreshVerificationCode() {
        this.verificationCode = new VerificationCode();
    }

    public resetPassword(newPassword: string): boolean {
        const hashedPassword = this.hashPassword(newPassword, this.salt);

        this.password = hashedPassword;
        this.verificationCode.reset();

        return true;
    }

    private hashPassword(password: string, salt: string): string {
        return bcrypt.hashSync(password, salt);
    }

    private generateSalt(): string {
        return bcrypt.genSaltSync(10);
    }
}
