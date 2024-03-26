import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * API layer DTO used in user registration
 */
export class RegisterForm {
    @ApiProperty({ example: 'info@usmedia.nl' })
    @IsString()
    email!: string;

    @ApiProperty({ example: 'HASHME' })
    @IsString()
    password!: string;
}
