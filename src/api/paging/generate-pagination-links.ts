import { resolveLink } from '@api/paging/link-resolver';
import { PagingParams } from '@api/paging/paging-params';
import { Link, Links } from '@api/paging/paging-response';

export function generatePaginationLinks<T>(link: Link, totalItems: number, paging: PagingParams<T>): Links {
    const pageIndex = paging.index;
    const pageSize = paging.size;
    const pageSort = paging.sort
        ? Object.keys(paging.sort)
              .map((key) => key + '+' + (paging.sort[key] as string))
              .join('&')
        : null;

    const maxPageIndex = Math.floor(totalItems / pageSize);

    const links: Links = {
        self: { href: resolveLink(link, { index: pageIndex, size: pageSize, sort: pageSort }) },
        first: { href: resolveLink(link, { index: 0, size: pageSize, sort: pageSort }) },
        last: { href: resolveLink(link, { index: maxPageIndex, size: pageSize, sort: pageSort }) },
    };

    if (pageIndex > 0) {
        links.prev = { href: resolveLink(link, { index: pageIndex - 1, size: pageSize, sort: pageSort }) };
    }

    if (pageIndex < maxPageIndex) {
        links.next = { href: resolveLink(link, { index: pageIndex + 1, size: pageSize, sort: pageSort }) };
    }

    return links;
}
