import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { Entry, EntryFacility, EntryPayroll, User } from '@domain/entities';

/**
 * API layer DTO used in the creation of a user
 */
export class EntryCreateForm {
    @ApiProperty({ example: 'My Facility', required: true })
    @IsString()
    facilityName: string;

    @ApiProperty({ example: 'OMN-23', required: false })
    @IsString()
    @IsOptional()
    facilityId: string;

    @ApiProperty({ example: '9bbbb1a4-ab19-4fd1-a507-adea8baf256e', required: false })
    @IsString()
    @IsOptional()
    matrixId: string;

    @ApiProperty({ example: 2031, minLength: 3, maxLength: 3, required: true })
    @IsNumber()
    year: number;

    @ApiProperty({ example: 'NL', minLength: 2, maxLength: 2, nullable: true })
    @IsString()
    @IsOptional()
    countryCode?: string;

    @ApiProperty({ example: 'Bananas', required: true })
    @IsString()
    @IsOptional()
    product: string;

    @ApiProperty({ example: 'EUR', minLength: 3, maxLength: 3, nullable: true })
    @IsString()
    currencyCode: string;

    @ApiProperty({ example: 'Boxes', required: true })
    @IsString()
    @IsOptional()
    productionUnit: string;

    @ApiProperty({ example: '1000000', required: true })
    @IsNumber()
    @IsOptional()
    productionAmount: number;

    // Convert to database entity from DTO specification above
    public static toEntity(form: EntryCreateForm, user: User): Entry {
        return new Entry({
            userId: user.id,
            matrixId: form.matrixId,
            payroll: new EntryPayroll({
                year: form.year,
                currencyCode: form.currencyCode,
            }),
            facility: new EntryFacility({
                name: form.facilityName,
                countryCode: form.countryCode,
                facilityId: form.facilityId,
                products: form.product,
                productionUnit: form.productionUnit,
                productionAmount: form.productionAmount,
            }),
        });
    }
}
