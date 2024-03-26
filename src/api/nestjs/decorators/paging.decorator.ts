import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { PageFilter, PageSort, PagingParams, Sort } from '@api/paging/paging-params';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Paging = createParamDecorator((entityName: string, ctx: ExecutionContext): PagingParams<any> => {
    try {
        const request = ctx.switchToHttp().getRequest<Request>();

        return {
            index: getIndexFromRequest(request),
            size: getSizeFromRequest(request),
            sort: getSortFromRequest(request),
            filter: getFilterFromRequest(request),
            include: getIncludesFromRequest(request),
        };
    } catch (error) {
        throw new BadRequestException('Pagination query parameters are incorrect');
    }
});

const getIndexFromRequest = (request: Request): number => {
    const index = request.query.index || 0;
    return isNaN(+index) ? 0 : +index;
};

const getIncludesFromRequest = (request: Request) => {
    const param = request.query.include;
    if (typeof param === 'string') {
        return param.split(',');
    }

    return [];
};

const getSizeFromRequest = (request: Request): number => {
    const size = request.query.size || 25;
    return isNaN(+size) ? 25 : +size;
};

const getSortFromRequest = (request: Request): PageSort | null => {
    const sort: PageSort = {};
    if (!request.query.sort) {
        return null;
    }

    const querySort = request.query.sort as string[] | string;
    const params = Array.isArray(querySort) ? querySort : [querySort];

    params.forEach((param) => {
        const [attr, direction] = param.split(',');

        sort[attr] = (direction?.toUpperCase() as Sort) === Sort.DESC ? Sort.DESC : Sort.ASC;
    });

    return sort ? sort : null;
};

const getFilterFromRequest = (request: Request): PageFilter | null => {
    const filter: PageFilter = {};
    const keys = Object.keys(request.query).filter((key) => !['index', 'size', 'sort', 'include'].includes(key));

    for (const key of keys) {
        const param = request.query[key];
        const rawValue = Array.isArray(param) ? param[0] || null : param;

        if (!rawValue || typeof rawValue !== 'string') {
            break;
        }

        let value;
        if (rawValue === 'true' || rawValue === 'false') {
            // convert to boolean
            value = rawValue === 'true';
        } else {
            // +param tries to convert it to a number
            value = isNaN(+rawValue) ? rawValue : +rawValue;
        }

        filter[key] = value;
    }

    return filter ? filter : null;
};
