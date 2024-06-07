import { ValidationError, ValidationResult } from '@domain/schemas/error/schema-validation.error';

export class EntityValidationError<T = Record<string, any>>  extends Error {
    public readonly validationErrors: ValidationError[];

    constructor(message: string, result: ValidationResult<T>) {
        super(message);
        this.name = this.constructor.name;
        this.validationErrors = result.errors;
    }
}