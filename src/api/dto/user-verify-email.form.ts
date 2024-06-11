import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

/**
 * API layer DTO used in the resending of email verification code
 */
export class VerifyEmailForm {
    @ApiProperty({ example: 'info@usmedia.nl' })
    @IsEmail()
    email!: string;
}
