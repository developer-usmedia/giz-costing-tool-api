import { Injectable } from '@nestjs/common';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';

const OTP_AUTHENTICATOR_NAME = 'GIZ Costing Tool';
const OTP_AUTHENTICATOR_ISSUER = 'GIZ';

@Injectable()
export class OTPService {
    public generate2FASecret = async (): Promise<{ secret: speakeasy.GeneratedSecret; qrcode: string }> => {
        const secret = speakeasy.generateSecret({
            name: OTP_AUTHENTICATOR_NAME,
            issuer: OTP_AUTHENTICATOR_ISSUER,
        });
        const _qrCode = await qrcode.toDataURL(secret.otpauth_url);

        return { secret: secret, qrcode: _qrCode };
    };

    public verify2FACode = (secret: string, code: string): boolean => {
        return speakeasy.totp.verify({
            secret: secret,
            token: code,
            encoding: 'base32',
        });
    };
}
