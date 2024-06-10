import * as joi from 'joi';

import { ValidationResult } from '@domain/schemas/error/schema-validation.error';
import { cleanObjectClone } from './cleaner';

export const validate = <R = any>(schema: joi.ObjectSchema, data: Record<string, any>): ValidationResult<R> => {
    // Remove empty values for proper validation
    const clone = cleanObjectClone(data);
    const result = schema.validate(clone, { abortEarly: false });

    if (result.error) {
        return {
            isValid: false,
            errors: result.error.details.map((detail) => {
                const key = detail.path.join('.');
                return {
                    path: key,
                    message: detail.message.replace(/"/g, '\''),
                    value: result.error._original[key] ?? null,
                };
            }),
        };
    }

    return { isValid: true, value: result.value };
};