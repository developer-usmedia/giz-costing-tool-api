import { FilterQuery } from '@mikro-orm/core';
import { PagingParams } from '../paging/paging-params';

export function toWhereOptions<T>(params: PagingParams<T>): FilterQuery<T> {
    return (params.filter as FilterQuery<T>) || ({} as FilterQuery<T>);
}
