import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { SimulationFacility } from '@domain/embeddables/simulation-facility.embed';

export class SimulationFacilityForm {
    @ApiProperty({ example: 'My Banana Facility', nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'NLD', minLength: 2, maxLength: 3, nullable: true })
    @IsString()
    @IsOptional()
    countryCode?: string;

    @ApiProperty({ example: 'EUR', minLength: 3, maxLength: 3, nullable: true })
    @IsString()
    @IsOptional()
    currencyCode?: string;

    @ApiProperty({ example: 'Bananas', nullable: true })
    @IsString()
    @IsOptional()
    product?: string;

    @ApiProperty({ example: 'Box', nullable: true })
    @IsString()
    @IsOptional()
    unitOfProduction?: string;

    @ApiProperty({ example: 150000, minimum: 0, nullable: true })
    @IsNumber()
    @IsOptional()
    annualProduction?: number;

    @ApiProperty({ example: 'Lidl', nullable: true })
    @IsString()
    @IsOptional()
    buyerName?: string;

    @ApiProperty({ example: 50, minimum: 0, maximum: 100, description: 'In percentage (%)', nullable: true })
    @IsNumber()
    @IsOptional()
    buyerProportion?: number;

    public static toEntity(facility: SimulationFacility, form: SimulationFacilityForm): SimulationFacility {
        if (form.name) facility.name = form.name;
        if (form.countryCode) facility.countryCode = form.countryCode;
        if (form.currencyCode) facility.currencyCode = form.currencyCode;
        if (form.product) facility.product = form.product;
        if (form.unitOfProduction) facility.unitOfProduction = form.unitOfProduction;
        if (form.annualProduction) facility.annualProduction = form.annualProduction;
        if (form.buyerName) facility.buyerName = form.buyerName;
        if (form.buyerProportion) facility.buyerProportion = form.buyerProportion;

        return facility;
    }
}
