import { Injectable, Logger } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';

import { environment } from '@app/environment';
import { User } from '@domain/entities/user.entity';

@Injectable()
export class EmailService {
    public static readonly BASE_EMAIL = {
        from: environment.mail.from,
    };
    private readonly logger = new Logger(EmailService.name);

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
            this.logger.log(`Sending email to ${mail.to as string}`);

            if (environment.api.isLocal) {
                this.logger.log(mail);
                return true;
            }

            await SendGrid.send(mail);
            return true; // Any error will be caught below
        } catch (error) {
            this.logger.error(`Error while sending email to ${mail.to as string}`, error);
            throw error;
        }
    }
}
