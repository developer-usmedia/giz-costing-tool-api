import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * API layer DTO used in loggin in
 */
export class LoginForm {
    @ApiProperty({ example: 'info@usmedia.nl' })
    @IsString()
    email!: string;

    @ApiProperty({ example: 'HASHME' })
    @IsString()
    password!: string;
}
