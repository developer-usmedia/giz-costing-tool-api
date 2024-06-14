export interface ValidationResult<R = any> {
    isValid: boolean;
    errors?: ValidationError[];
    value?: R;
}

export interface ValidationError {
    path: string;
    message: string;
    value: any;
    type: string;
}