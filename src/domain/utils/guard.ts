export type GuardType = 'string' | 'number' | 'boolean' | 'array' | 'date' | 'object'; // Left out 'bigint' & 'symbol'

/**
 * Regular expression patterns for various guard checks.
 *
 * Note these are kept simple as proper validation should be done on a higher level.
 * And for most of these regexes, an uppercase string is assumed (except email).
 */
export const GuardRegex = {
    COUNTRY_CODE2: /^[A-Z]{2}$/,
    COUNTRY_CODE3: /^[A-Z]{3}$/,
    CURRENCY_CODE: /^[A-Z]{3}$/,
    YEAR: /^[0-9]{4}$/,
    IBAN: /^[A-Z]{2}\d{2}[A-Z0-9]{4}\d{10}$/,
    PHONE: /^0[1-9]\d{8}$/,
    MOBILE: /^06\d{8}$/,
    POSTCODE_NL: /^\d{4}[A-Z]{2}$/,
    EMAIL: /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/i,
    UUID: /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/,
    URL: /(?:https?):\/\/(?:www\.)?[^/\r\n]+/,
};

export interface GuardChecks {
    type: GuardType; // Which type the value needs to be checked against
    optional?: boolean; // Whether the value is optional (can be undefined or null), default is false
    allowEmpty?: boolean; // Whether empty strings (or arrays) are allowed, default is false
    minLength?: number; // Minimum length for strings (or arrays)
    maxLength?: number; // Maximum length for strings (or arrays)
    regex?: RegExp; // Regular expression to match against strings
    min?: number; // Minimum value for numbers
    max?: number; // Maximum value for numbers
    minDate?: Date; // Minimum value for Dates
    maxDate?: Date; // Maximum value for Dates
    enum?: Record<string, string>; // Check string value against enum values
}

/**
 * The Guard class provides static methods for checking the validity of values based on specified guard checks.
 *
 * @example
 * Guard.check(email, { type: 'string', regex: GuardRegex.EMAIL, maxLength: 255 });
 * Guard.check(amount, { type: 'number', min: 0 });
 * Guard.check(description, { type: 'string', optional: true });
 */
export class Guard {
    /**
     * Checks if the given value satisfies the specified guard checks.
     *
     * @param value - The value to be checked.
     * @param checks - The guard checks to be applied.
     * @throws {Error} If the given type is unknown or the value doesn't pass one of the checks
     */
    public static check(value: unknown, checks: GuardChecks): void {
        switch (checks.type) {
            case 'string':  this.checkString(value, checks);    return;
            case 'number':  this.checkNumber(value, checks);    return;
            case 'boolean': this.checkBoolean(value, checks);   return;
            case 'array':   this.checkArray(value, checks);     return;
            case 'date':    this.checkDate(value, checks);      return;
            case 'object':  this.checkObject(value, checks);    return;
            default: throw new Error(`Given type is unknown (${checks.type as string})`);
        }
    }

    /**
     * Checks if a value is a valid string based on the provided checks.
     *
     * @param value - The value to be checked.
     * @param checks - The checks to be applied on the string.
     * @throws {Error} If the given value doesn't pass one of the checks
     */
    public static checkString(value: unknown, checks: GuardChecks): void {
        this.isString(value, checks.optional);

        if (checks.allowEmpty !== true) {
            this.isStringNotEmpty(value as string);
        }

        if (checks.maxLength) {
            this.maxStringLength(value as string, checks.maxLength);
        }

        if (checks.minLength) {
            this.minStringLength(value as string, checks.minLength);
        }

        if (checks.regex) {
            this.regex(value as string, checks.regex);
        }

        if (checks.enum && !checks.optional) {
            this.checkEnum(value as string, checks.enum);
        }
    }

    /**
     * Checks if a value is a valid number based on the provided checks.
     *
     * @param value - The value to be checked.
     * @param checks - The checks to be applied on the number.
     * @throws {Error} If the given value doesn't pass one of the checks
     */
    public static checkNumber(value: unknown, checks: GuardChecks): void {
        this.isNumber(value, checks.optional);

        if (checks.max) {
            this.maxValue(value as number, checks.max);
        }

        if (checks.min) {
            this.minValue(value as number, checks.min);
        }
    }

    /**
     * Checks if a value is a valid boolean based on the provided checks.
     *
     * @param value - The value to be checked.
     * @param checks - The checks to be applied on the boolean.
     * @throws {Error} If the given value doesn't pass one of the checks
     */
    public static checkBoolean(value: unknown, checks: GuardChecks): void {
        this.isBoolean(value, checks.optional);
    }

    /**
     * Checks if a value is a valid array based on the provided checks.
     *
     * @param value - The value to be checked.
     * @param checks - The checks to be applied on the array.
     * @throws {Error} If the given value doesn't pass one of the checks
     */
    public static checkArray(value: unknown, checks: GuardChecks): void {
        this.isArray(value, checks.optional);

        if (checks.maxLength) {
            this.maxArrayLength(value as unknown[], checks.maxLength);
        }

        if (checks.minLength) {
            this.minArrayLength(value as unknown[], checks.minLength);
        }
    }

    /**
     * Checks if a value is a valid date based on the provided checks.
     *
     * @param value - The value to be checked.
     * @param checks - The checks to be applied on the date.
     * @throws {Error} If the given value doesn't pass one of the checks
     */
    public static checkDate(value: unknown, checks: GuardChecks): void {
        this.isDate(value, checks.optional);

        if (checks.maxDate) {
            this.maxDate(value as Date, checks.maxDate);
        }

        if (checks.minDate) {
            this.minDate(value as Date, checks.minDate);
        }
    }

    /**
     * Checks if a value is a valid object based on the provided checks.
     *
     * @param value - The value to be checked.
     * @param checks - The checks to be applied on the object.
     * @throws {Error} If the given value doesn't pass one of the checks
     */
    public static checkObject(value: unknown, checks: GuardChecks): void {
        this.isObject(value, checks.optional);

        if (checks.optional !== true) {
            this.isDefined(value);
        }
    }

    /**
     * Checks if a value is defined.
     *
     * @param value - The value to be checked.
     * @throws {Error} - Throws an error if the value is null or undefined.
     */
    public static isDefined(value: unknown): void {
        if (value === null || typeof value === 'undefined') {
            throw new Error('Value is undefined');
        }
    }

    /**
     * Checks if a value is a string.
     *
     * @param value - The value to be checked.
     * @param [isOptional=false] - If set to true, no error will be thrown if the value is undefined.
     * @throws {Error} If the value is not a string.
     */
    public static isString(value: unknown, isOptional = false): void {
        if (!isOptional) {
            this.isDefined(value);
        }

        if (value && typeof value !== 'string') {
            throw new Error('Value is not a string');
        }
    }

    /**
     * Checks if a value is a number.
     *
     * @param value - The value to be checked.
     * @param [isOptional=false] - If set to true, no error will be thrown if the value is undefined.
     * @param [checkFinite=true] - Optional parameter to check if the number is finite.
     * @throws {Error} - Throws an error if the value is not a number.
     */
    public static isNumber(value: unknown, isOptional = false, checkFinite = true): void {
        if (!isOptional) {
            this.isDefined(value);
        }

        if (value && (typeof value !== 'number' || (checkFinite && !Number.isFinite(value)))) {
            throw new Error('Value is not a number');
        }
    }

    /**
     * Determines if the value is a boolean.
     *
     * @param value - The value to be checked.
     * @param [isOptional=false] - If set to true, no error will be thrown if the value is undefined.
     * @throws {Error} - Throws an error if the value is not a boolean.
     */
    public static isBoolean(value: unknown, isOptional = false): void {
        if (!isOptional) {
            this.isDefined(value);
        }

        if (value && typeof value !== 'boolean') {
            throw new Error('Value is not a boolean');
        }
    }

    /**
     * Checks if a value is an array.
     *
     * @param value - The value to be checked.
     * @param [isOptional=false] - If set to true, no error will be thrown if the value is undefined.
     * @throws {Error} - Throws an error if the value is not an array.
     */
    public static isArray(value: unknown, isOptional = false): void {
        if (!isOptional) {
            this.isDefined(value);
        }

        if (value && !Array.isArray(value)) {
            throw new Error('Value is not an array');
        }
    }

    /**
     * Checks if the given value is a valid date.
     *
     * @param value - The value to be checked.
     * @param [isOptional=false] - If set to true, no error will be thrown if the value is undefined.
     * @throws {Error} If the value is not a date.
     */
    public static isDate(value: unknown, isOptional = false): void {
        if (!isOptional) {
            this.isDefined(value);
        }

        if (value && !(value instanceof Date)) {
            throw new Error('Value is not a date');
        }
    }

    /**
     * Checks if the given value is an object.
     *
     * @param value - The value to be checked.
     * @param [isOptional=false] - If set to true, no error will be thrown if the value is undefined.
     * @throws {Error} If the value is not an object.
     */
    public static isObject(value: unknown, isOptional = false): void {
        if (!isOptional) {
            this.isDefined(value);
        }

        if (value && typeof value !== 'object') {
            throw new Error('Value is not an object');
        }
    }

    /**
     * Checks if a value is a BigInt.
     *
     * @param value - The value to be checked.
     * @param [isOptional=false] - If set to true, no error will be thrown if the value is undefined.
     * @throws {Error} Throws an error if the value is not a BigInt.
     */
    public static isBigInt(value: unknown, isOptional = false): void {
        if (!isOptional) {
            this.isDefined(value);
        }

        if (typeof value !== 'bigint') {
            throw new Error('Value is not a bigint');
        }
    }

    /**
     * Checks if the given value is a symbol.
     *
     * @param value - The value to be checked.
     * @param [isOptional=false] - If set to true, no error will be thrown if the value is undefined.
     * @throws {Error} - Throws an error if the value is not a Symbol.
     */
    public static isSymbol(value: unknown, isOptional = false): void {
        if (!isOptional) {
            this.isDefined(value);
        }

        if (typeof value !== 'symbol') {
            throw new Error('Value is not an symbol');
        }
    }

    /**
     * Checks if a string is not empty.
     *
     * @param value - The string to be checked.
     * @param [checkTrimmed=true] - Determines whether to check against a trimmed value (or not).
     * @throws {Error} When the value is an empty string.
     */
    public static isStringNotEmpty(value: string, checkTrimmed = true): void {
        if (!value || (checkTrimmed ? value.trim().length === 0 : value.length === 0)) {
            throw new Error('Value is an empty string');
        }
    }

    /**
     * Checks if the given string is longer than the specified maximum length.
     *
     * @param value - The string to be checked.
     * @param max - The maximum length to compare against.
     * @throws {Error} - Throws an error if the string is longer than the specified maximum length.
     */
    public static maxStringLength(value: string | null | undefined, max: number): void {
        if (value && value.length > max) {
            throw new Error(`String is too long (> ${max})`);
        }
    }

    /**
     * Checks if a given string meets or exceeds the minimum required length.
     *
     * @param value - The string to be checked.
     * @param min - The minimum length to compare against.
     * @throws {Error} - Throws an error if the string is too short.
     */
    public static minStringLength(value: string | null | undefined, min: number): void {
        if (value && value.length < min) {
            throw new Error(`String is too short (< ${min})`);
        }
    }

    /**
     * Checks if a given value matches a specified regular expression.
     *
     * @param value - The string to be checked.
     * @param regex - The regular expression to match against.
     * @throws {Error} Throws an error if the value does not match the regular expression.
     */
    public static regex(value: string | null | undefined, regex: RegExp): void {
        if (value && !regex.test(value)) {
            throw new Error(`Value does not match regex (${regex})`);
        }
    }

    /**
     * Calculates the maximum allowed value based on the given value and maximum value.
     * If the given value is greater than the maximum value, it throws an error.
     *
     * @param value - The number to be checked.
     * @param max - The maximum to compare against.
     * @throws {Error} - Throws an error if the value exceeds the maximum value.
     */
    public static maxValue(value: number | null | undefined, max: number): void {
        if (value && value > max) {
            throw new Error(`Number value is too high (> ${max})`);
        }
    }

    /**
     * Returns an error if the given value is less than the minimum value.
     *
     * @param value - The number to be checked.
     * @param min - The minimum to compare against.
     * @throws {Error} - Throws an error if the value is less than the minimum value.
     */
    public static minValue(value: number | null | undefined, min: number): void {
        if (value && value < min) {
            throw new Error(`Number value is too low (< ${min})`);
        }
    }

    /**
     * Checks if the provided array is not exceed the maximum length.
     *
     * @param value - The array to be checked.
     * @param max - The maximum length to compare against.
     * @throws {Error} If the array's length exceeds the specified maximum length.
     */
    public static maxArrayLength(value: unknown[] | null | undefined, max: number): void {
        if (value && value.length > max) {
            throw new Error(`Array contains too many items (> ${max})`);
        }
    }

    /**
     * Checks if the provided array does not exceed the minimum length.
     *
     * @param value - The array to be checked.
     * @param min - The minimum length to compare against.
     * @throws {Error} - Throws an error if the array contains too few items.
     */
    public static minArrayLength(value: unknown[] | null | undefined, min: number): void {
        if (value && value.length < min) {
            throw new Error(`Array contains too few items (< ${min})`);
        }
    }

    /**
     * Checks if the provided date does not exceed the maximum date.
     *
     * @param value - The date to be checked.
     * @param max - The maximum date to compare against. If undefined, 'now' is used.
     * @throws {Error} Throws an error if the value is a date that is greater than the maximum date.
     */
    public static maxDate(value: Date | null | undefined, max?: Date): void {
        max = max ?? new Date();
        if (value && value > max) {
            throw new Error(`Date is too far in the future (after ${max.toISOString()})`);
        }
    }

    /**
     * Checks if the provided date does not exceed the minimum date.
     *
     * @param value - The date to be checked.
     * @param min - The minimum date to compare against. If undefined, 'now' is used.
     * @throws {Error} - Throws an error if the date is before the minimum date.
     */
    public static minDate(value: Date | null | undefined, min?: Date): void {
        min = min ?? new Date();
        if (value && value < min) {
            throw new Error(`Date is too far in the past (before ${min.toISOString()})`);
        }
    }

    /**
     * Checks if the provided string is a valid enum entry
     *
     * @param value - The string to be checked.
     * @param enumObj - The emum object to check the string against
     * @throws {Error} - Throws an error if the string is not a valid entry in the provided enum
     */
    public static checkEnum(value: string, enumObj: Record<string, string>): void {
        if (!Object.values(enumObj).includes(value)) {
            throw new Error(`Value ${value} is not present in enum ${Object.values(enumObj).toString()}`);
        }
    }
}
