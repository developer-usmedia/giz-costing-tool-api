import { FindOptions, QueryOrderMap } from '@mikro-orm/core';

import { PagingParams } from '../paging/paging-params';

export function toFindOptions<T, P extends string = never>(params: PagingParams<T>): FindOptions<T, P> {
    return {
        limit: params.size,
        offset: params.index * params.size,
        orderBy: params.sort as QueryOrderMap<T>,
        populate: params.include as any,
    };
}
