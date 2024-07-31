import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * API layer DTO used in loggin in
 */
export class LoginForm {
    @ApiProperty({ example: 'debug@usmedia.nl' })
    @IsString()
    email!: string;

    @ApiProperty({ example: 'HASHME' })
    @IsString()
    password!: string;

    @ApiProperty({ example: 'ZRR9QP' })
    @IsString()
    @IsOptional()
    emailVerificationCode?: string;

    @ApiProperty({ example: 'A3FK2Q' })
    @IsString()
    @IsOptional()
    otpCode?: string;
}
