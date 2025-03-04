import * as _cloneDeep from 'lodash.clonedeep';

/**
 * Returns the given object, with all 'empty' values removed (with deep checks)
 *
 * Considered empty
 * - null
 * - undefined
 * - '' (empty string)
 *
 * @param data
 */
export const cleanObject = <T = Record<string, any>>(data: T): T => {
    Object.keys(data)
        .forEach(key => {
            if (data[key] && Array.isArray(data[key])) {
                data[key].forEach((item: any) => cleanObject(item));
            }
            else if (data[key] && typeof data[key] === 'object') {
                cleanObject(data[key]);
            }
            else if (data[key] === null || data[key] === undefined || data[key] === '') {
                delete data[key];
            }
        });

    return data;
};

export const cleanObjectClone = <T = Record<string, any>>(data: T): T => {
    return cleanObject( _cloneDeep(data) );
};
