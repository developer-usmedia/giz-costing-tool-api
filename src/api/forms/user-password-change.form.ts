import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * API layer DTO used in changing a password
 */
export class PasswordChangeForm {
    @ApiProperty({ example: 'debug@usmedia.nl' })
    @IsString()
    email!: string;

    @ApiProperty({ example: 'HASHME' })
    @IsString()
    password!: string;

    @ApiProperty({ example: 'HASHME' })
    @IsString()
    newPassword!: string;

    @ApiProperty({ example: '01235' })
    @IsString()
    @IsOptional()
    otpCode?: string;
}
