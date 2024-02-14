import { environment } from '@common/environment/environment';
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

    public async send(mail: MailDataRequired): Promise<boolean> {
        try {
            console.info(`Sending email to ${mail.to as string}`);

            await SendGrid.send(mail);
            return true; // Any error will be caught below
        } catch (error) {
            console.error(`Error while sending email to ${mail.to as string}`, error);
            throw error;
        }
    }
}
