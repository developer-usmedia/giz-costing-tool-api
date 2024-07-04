import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * API layer DTO used in verifying twofactor code from requst
 */
export class TwoFactorForm {
    @ApiProperty({ example: 'A3FK2Q' })
    @IsString()
    @IsOptional()
    twoFactorCode?: string;
}
