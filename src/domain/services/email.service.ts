import { environment } from '@common/environment/environment';
import { User } from '@database/entities';
import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class EmailService {
    public static readonly BASE_EMAIL = {
        from: environment.mail.from,
    };

    constructor() {
        SendGrid.setApiKey(environment.mail.apiKey);
    }

    public sendEmailVerificationEmail = async (user: User) => {
        const email: MailDataRequired = {
            ...EmailService.BASE_EMAIL,
            to: user.email,
            subject: 'GIZ Costing Tool Email Verification Code',
            content: [{ type: 'text/plain', value: `Verification code: ${user.verificationCode.code}` }],
        };

        return await this.send(email);
    };

    public sendPasswordResetEmail = async (user: User) => {
        const email: MailDataRequired = {
            ...EmailService.BASE_EMAIL,
            to: user.email,
            subject: 'GIZ Costing Tool Password Reset Code',
            content: [{ type: 'text/plain', value: `Reset code: ${user.verificationCode.code}` }],
        };

        return await this.send(email);
    };

    public async send(mail: MailDataRequired): Promise<boolean> {
        try {
            console.info(`Sending email to ${mail.to as string}`);

            if (environment.api.isLocal) {
                console.info(mail);
                return true;
            }

            await SendGrid.send(mail);
            return true; // Any error will be caught below
        } catch (error) {
            console.error(`Error while sending email to ${mail.to as string}`, error);
            throw error;
        }
    }
}
