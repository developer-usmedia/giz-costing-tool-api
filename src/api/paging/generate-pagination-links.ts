import { resolveLink } from '@api/paging/link-resolver';
import { PagingParams } from '@api/paging/paging-params';
import { PaginationLinks } from '@api/paging/paging-response';

export function generatePaginationLinks<T>(url: URL, totalItems: number, paging: PagingParams<T>): PaginationLinks {
    const pageIndex = paging.index;
    const pageSize = paging.size;
    const pageSort = paging.sort
        ? Object.keys(paging.sort)
              .map((key) => key + '+' + (paging.sort[key] as string))
              .join('&')
        : '';

    const maxPageIndex = Math.floor(totalItems / pageSize);

    const links: PaginationLinks = {
        self: { href: resolveLink(url, { index: pageIndex, size: pageSize, sort: pageSort }) },
        first: { href: resolveLink(url, { index: 0, size: pageSize, sort: pageSort }) },
        last: { href: resolveLink(url, { index: maxPageIndex, size: pageSize, sort: pageSort }) },
    };

    if (pageIndex > 0) {
        links.prev = { href: resolveLink(url, { index: pageIndex - 1, size: pageSize, sort: pageSort }) };
    }

    if (pageIndex < maxPageIndex) {
        links.next = { href: resolveLink(url, { index: pageIndex + 1, size: pageSize, sort: pageSort }) };
    }

    return links;
}
