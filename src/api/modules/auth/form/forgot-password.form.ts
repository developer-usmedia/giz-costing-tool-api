import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * API layer DTO used starting password reset flow
 */
export class ForgotPasswordForm {
    @ApiProperty({ example: 'info@usmedia.nl' })
    @IsString()
    email!: string;
}
