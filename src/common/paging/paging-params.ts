import { EntityKey, QueryOrderNumeric } from '@mikro-orm/postgresql';

export enum Sort {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface PagingParams<T> {
    index: number;
    size: number;
    filter?: {
        [P in keyof T]?: any;
    };
    sort?: {
        [K in keyof EntityKey<T> as string]?: QueryOrderNumeric | Sort;
    };
    include?: string[];
}

export interface PageSort {
    [key: string]: Sort;
}

export interface PageFilter {
    [key: string]: string | number | boolean | (string | number | boolean)[];
}
