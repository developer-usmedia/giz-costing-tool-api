import * as joi from 'joi';

import { Gender, GENDER_OPTIONS } from '@domain/entities';

let schema: joi.ObjectSchema;

export interface EntryWorkerData {
    name: string;
    gender: Gender;
    nrOfWorkers: number;
    monthlyWage: number;
    monthlyBonus: number;
    monthlyIkbCapped: number;
    percOfYearWorked: number;
}

const entryWorkerSchema = (): joi.ObjectSchema => {
    schema = joi.object({
        name:                       joi.string().trim().max(255).required(),
        gender:                     joi.string().trim().valid(...GENDER_OPTIONS).required(),
        nrOfWorkers:                joi.number().min(1).required(),
        monthlyWage:                joi.number().min(1).required(),
        monthlyBonus:               joi.number().min(0).required(),
        monthlyIkbCapped:           joi.number().min(0).required(),
        percOfYearWorked:           joi.number().min(0).max(100).required(),
    });

    return schema;
};

export const getEntryWorkerSchema = (): joi.ObjectSchema => schema || entryWorkerSchema();
