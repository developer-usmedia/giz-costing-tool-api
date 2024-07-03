import * as joi from 'joi';

let schema: joi.ObjectSchema;

export interface EntryInfo {
    matrixId: string;
    facilityName: string;
    facilityId: string;
    benchmarkValue?: number;
    country: string;
    region: string;
    productionAmount: number;
    productionUnit: string;
    productName: string;
    year: number;
    currencyCode: string;
}

const entryInfoSchema = (): joi.ObjectSchema => {
    schema = joi.object({
        matrixId:               joi.string().trim().max(255).required(),
        facilityName:           joi.string().trim().max(255).required(),
        facilityId:             joi.string().trim().max(255).required(),
        benchmarkValue:         joi.number().min(0),
        country:                joi.string().trim().max(255).required(),
        region:                 joi.string().trim().max(255).required(),
        productionAmount:       joi.number().min(1).required(),
        productionUnit:         joi.string().trim().max(255).required(),
        productName:            joi.string().trim().max(255).optional(),
        year:                   joi.number().min(0).max(2100).required(),
        currencyCode:           joi.string().trim().max(255).required(),
    });

    return schema;
};

export const getEntryInfoSchema = (): joi.ObjectSchema => schema || entryInfoSchema();
