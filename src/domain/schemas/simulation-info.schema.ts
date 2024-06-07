import * as joi from 'joi';

let schema: joi.ObjectSchema;

export interface SimulationInfo {
    matrixId: string;
    facilityName: string;
    facilityId: string;
    countryCode: string;
    country: string;
    region: string;
    annualProduction: number;
    unitOfProduction: string;
    productName: string;
    year: number;
    currencyCode: string;
}

const simulationInfoSchema = (): joi.ObjectSchema => {
    schema = joi.object({
        facilityName:           joi.string().trim().max(255).required(),
        facilityId:             joi.string().trim().max(255).required(),
        // TODO: make required and remove default when IDH has updated export to include this facility value
        countryCode:            joi.string().trim().max(255).optional().default('NL'),  
        country:                joi.string().trim().max(255).required(),
        region:                 joi.string().trim().max(255).required(),
        annualProduction:       joi.number().min(1).required(),
        unitOfProduction:       joi.string().trim().max(255).required(),
        productName:            joi.string().trim().max(255).required(),
        year:                   joi.number().min(0).max(2100).required(),
        currencyCode:           joi.string().trim().max(255).required(),
    });

    return schema;
};

export const getSimulationInfoSchema = (): joi.ObjectSchema => schema || simulationInfoSchema();
