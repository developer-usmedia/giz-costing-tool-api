import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * API layer DTO used in resetting password
 */
export class PasswordResetForm {
    @ApiProperty({ example: 'debug@usmedia.nl' })
    @IsString()
    email!: string;

    @ApiProperty({ example: 'HASHME' })
    @IsString()
    newPassword!: string;

    @ApiProperty({ example: '01235' })
    @IsString()
    resetToken!: string;
}
