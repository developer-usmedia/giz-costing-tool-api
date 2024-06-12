import * as brevo from '@getbrevo/brevo';
import { Injectable, Logger } from '@nestjs/common';

import { environment } from '@app/environment';
import { User } from '@domain/entities/user.entity';

export type BrevoEmail = { email: string; name?: string };

@Injectable()
export class BrevoService {
    private readonly logger = new Logger(BrevoService.name);
    private readonly client: brevo.TransactionalEmailsApi;
    private readonly from: BrevoEmail = {
        name: environment.mail.fromName,
        email: environment.mail.fromEmail,
    };

    constructor() {
        this.client = new brevo.TransactionalEmailsApi();
        this.client.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, environment.mail.apiKey);
    }

    public sendEmailVerificationEmail = async (user: User) => {
        const emailContent = `
        Hi,

        We have received a request to verify your email for the GIZ Costing Tool.

        Your verification code: ${user.verificationCode.code}.

        If you did not initiate this request, please ignore this email. Should the issue persist, kindly reach out to us at ina@giz.de to report it.

        Kind regards,
        GIZ`;

        const smtpEmail = new brevo.SendSmtpEmail();
        smtpEmail.subject = 'GIZ Costing Tool - Email Verification Code';
        smtpEmail.textContent = emailContent;

        return await this.sendMail(smtpEmail, { email: user.email });
    };

    public sendPasswordResetEmail = async (user: User) => {
        const emailContent = `
        Hi,

        We have received a password reset request for your GIZ Costing Tool account.

        Your password reset code: ${user.verificationCode.code}.

        If you did not initiate this request, please ignore this email. Should the issue persist, kindly reach out to us at ina@giz.de to report it.

        Kind regards,
        GIZ`;

        const smtpEmail = new brevo.SendSmtpEmail();
        smtpEmail.subject = 'GIZ Costing Tool - Password Reset Code';
        smtpEmail.textContent = emailContent;

        return await this.sendMail(smtpEmail, { email: user.email });
    };

    public sendPasswordChangedEmail = async (user: User) => {
        const emailContent = `
        Hi,

        This email confirms that the password for your GIZ Costing Tool account has been successfully changed.

        If you did not initiate this change, please contact us immediately at ina@giz.de to report unauthorized access.

        For your reference, we recommend storing this email in a secure location.

        Kind regards,

        GIZ`;

        const smtpEmail = new brevo.SendSmtpEmail();
        smtpEmail.subject = 'GIZ Costing Tool - Your password has been changed';
        smtpEmail.textContent = emailContent;

        return await this.sendMail(smtpEmail, { email: user.email });
    };

    private async sendMail(
        smtpEmail: brevo.SendSmtpEmail,
        to: BrevoEmail,
        data?: Record<string, any>,
    ): Promise<boolean> {
        smtpEmail.sender = { email: environment.mail.fromEmail, name: environment.mail.fromName };
        smtpEmail.to = [{ email: to.email, name: to.name }];

        if (data) {
            smtpEmail.params = data;
        }

        this.logger.debug('Sending email with params', smtpEmail.params);

        if (environment.api.isLocal) {
            this.logger.log(smtpEmail.textContent);
            return true;
        }

        return this.client
            .sendTransacEmail(smtpEmail)
            .then((info) => {
                this.logger.debug(`Email sent succesfully ${info.response.statusCode}`);
                return true;
            })
            .catch((error) => {
                this.logger.error('Email API error: ', error);
                return false;
            });
    }
}
