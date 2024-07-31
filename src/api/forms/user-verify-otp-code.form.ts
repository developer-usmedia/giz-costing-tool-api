import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * API layer DTO used in the resending of email verification code
 */
export class VerifyOtpCode {
    @ApiProperty({ example: 'HASHME' })
    @IsString()
    password!: string;

    @ApiProperty({ example: 'A3FK2Q' })
    @IsString()
    otpCode: string;
}
