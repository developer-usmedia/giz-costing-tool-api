import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

/**
 * API layer DTO used in the resending of email verification code
 */
export class VerifyEmailForm {
    @ApiProperty({ example: '9d9a58a1-6634-4588-8b13-a35c5f308476' })
    @IsString()
    @IsUUID()
    userId!: string;
}
