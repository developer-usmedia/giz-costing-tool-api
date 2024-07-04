import * as joi from 'joi';

import { ValidationResult } from '@import/errors/schema-validation.error';
import { cleanObjectClone } from '@domain/utils/cleaner';

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
                    type: detail.type,
                };
            }),
        };
    }

    return { isValid: true, value: result.value };
};
