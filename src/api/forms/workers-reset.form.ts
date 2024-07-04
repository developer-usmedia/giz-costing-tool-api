import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export type WorkersResetType = 'distribution' | 'specification' | 'all';

export class WorkersResetForm {
    @ApiProperty({ example: 'distribution' })
    @IsIn(['distribution', 'specification', 'all'])
    type: WorkersResetType;
}
