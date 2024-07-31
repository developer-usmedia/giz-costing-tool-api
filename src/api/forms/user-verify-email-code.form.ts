import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

/**
 * API layer DTO used in the validation of email code
 */
export class VerifyEmailCodeForm {
    @ApiProperty({ example: 'info@usmedia.nl' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '123456' })
    code!: string;
}
