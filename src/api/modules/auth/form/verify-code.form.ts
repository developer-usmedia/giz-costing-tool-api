import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

/**
 * API layer DTO used in the resending of verification code validation
 */
export class VerifyCodeForm {
    @ApiProperty({ example: 'info@usmedia.nl' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '123456' })
    code!: string;
}
