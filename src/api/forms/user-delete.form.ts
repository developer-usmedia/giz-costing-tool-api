import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * API layer DTO used in deleting a user
 */
export class UserDeleteForm {
    @ApiProperty({ example: 'debug@usmedia.nl' })
    @IsString()
    email!: string;

    @ApiProperty({ example: 'HASHME' })
    @IsString()
    password!: string;

    @ApiProperty({ example: 'A3FK2Q' })
    @IsString()
    @IsOptional()
    otpCode?: string;
}
