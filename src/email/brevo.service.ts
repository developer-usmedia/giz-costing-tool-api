import * as brevo from '@getbrevo/brevo';
import { Injectable, Logger } from '@nestjs/common';

import { environment } from 'environment';
import { SendSmtpEmail } from '@getbrevo/brevo/model/sendSmtpEmail';

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

    public sendEmailVerificationEmail = async (email: string, verificationCode: string) => {
        const subject = 'GIZ Costing Tool - Email Verification Code';
        const content = `Hi,

We have received a request to verify your email for the GIZ Costing Tool.

Your verification code: ${verificationCode}.

If you did not initiate this request, please ignore this email. Should the issue persist, kindly reach out to us at ina@giz.de to report it.

Kind regards,
GIZ`;

        return this.sendTextMail(this.from, { email: email }, subject, content);
    };

    public sendPasswordResetEmail = async (email: string, verificationCode: string) => {
        const subject = 'GIZ Costing Tool - Password Reset Code';
        const content = `Hi,

We have received a password reset request for your GIZ Costing Tool account.

Your password reset code: ${verificationCode}.

If you did not initiate this request, please ignore this email. Should the issue persist, kindly reach out to us at ina@giz.de to report it.

Kind regards,
GIZ`;

        return this.sendTextMail(this.from, { email: email }, subject, content);
    };

    public sendPasswordChangedEmail = async (email: string) => {
        const subject = 'GIZ Costing Tool - Your password has been changed';
        const content = `Hi,

This email confirms that the password for your GIZ Costing Tool account has been successfully changed.

If you did not initiate this change, please contact us immediately at ina@giz.de to report unauthorized access.

Kind regards,
GIZ`;

        return this.sendTextMail(this.from, { email: email }, subject, content);
    };

    private async sendTextMail(
        sender: BrevoEmail,
        to: BrevoEmail,
        subject: string,
        body: string,
    ): Promise<boolean> {
        const textEmail = new brevo.SendSmtpEmail();
        textEmail.sender = sender;
        textEmail.to = [ to ];
        textEmail.subject = subject;
        textEmail.textContent = body;

        this.logger.debug(`Sending text email to ${to.email}`);
        this.logger.verbose(subject, body);

        return this.sendTransactionalEmail(textEmail);
    }

    private async sendTemplatedMail(
        sender: BrevoEmail,
        to: BrevoEmail,
        templateId: number,
        templateData?: Record<string, any>,
    ): Promise<boolean> {
        const templatedEmail = new brevo.SendSmtpEmail();
        templatedEmail.sender = sender;
        templatedEmail.to = [ to ];
        templatedEmail.templateId = templateId;

        if (templateData) {
            templatedEmail.params = templateData;
        }

        this.logger.debug(`Sending templated email to ${to.email}`);
        this.logger.verbose(templateId, templateData);

        return this.sendTransactionalEmail(templatedEmail);
    }

    private async sendTransactionalEmail(
        email: SendSmtpEmail,
    ): Promise<boolean> {
        return this.client
            .sendTransacEmail(email)
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
