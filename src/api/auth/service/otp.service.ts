import { Injectable } from '@nestjs/common';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';

import { environment } from 'environment';

const OTP_AUTHENTICATOR_NAME = 'GIZ Costing Tool';
const OTP_AUTHENTICATOR_ISSUER = 'GIZ';

@Injectable()
export class OTPService {
    public generate2FASecret = async (): Promise<{ secret: speakeasy.GeneratedSecret; qrcode: string }> => {
        let ISSUER_NAME = OTP_AUTHENTICATOR_NAME;

        if (environment.api.env === 'staging' || environment.api.env === 'development') {
            ISSUER_NAME += ' (Test)';
        }

        const secret = speakeasy.generateSecret({
            name: ISSUER_NAME,
            issuer: OTP_AUTHENTICATOR_ISSUER,
        });
        const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url, { width: 400 });

        return { secret: secret, qrcode: qrDataUrl };
    };

    public verify2FACode = (secret: string, code: string): boolean => {
        return speakeasy.totp.verify({
            secret: secret,
            token: code,
            encoding: 'base32',
        });
    };
}
