import * as joi from 'joi';

import { GENDER_OPTIONS, Gender } from '@domain/enums/gender.enum';

let schema: joi.ObjectSchema;

export interface WorkerData {
    name: string;
    gender: Gender;
    numberOfWorkers: number;
    monthlyWage: number;
    percentageOfYearsWorked: number;
    ikbFood: number;
    ikbTransportation: number;
    ikbHousing: number;
    ikbHealthcare: number;
    ikbChildcare: number;
    employeeTax?: number;
    employerTax?: number;
}

const workerSchema = (): joi.ObjectSchema => {
    schema = joi.object({
        name:                       joi.string().trim().max(255).required(),
        gender:                     joi.string().trim().valid(...GENDER_OPTIONS).required(),
        numberOfWorkers:            joi.number().min(1).required(),
        monthlyWage:                joi.number().min(1).required(),
        percentageOfYearsWorked:    joi.number().min(0).max(100).required(),
        ikbFood:                    joi.number().min(0).required(),
        ikbTransportation:          joi.number().min(0).required(),
        ikbHousing:                 joi.number().min(0).required(),
        ikbHealthcare:              joi.number().min(0).required(),
        ikbChildcare:               joi.number().min(0).required(),
        employeeTax:                joi.number().min(0),
        employerTax:                joi.number().min(0),
    });

    return schema;
};

export const getWorkerSchema = (): joi.ObjectSchema => schema || workerSchema();
