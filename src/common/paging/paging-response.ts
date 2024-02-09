export interface PagedResponse<T> extends HateoasResponse {
    data: T[];
}

export interface HateoasResponse {
    // _embedded: {
    //     [key: string]: T[];
    // };
    // _page: {
    //     index: number;
    //     size: number;
    //     totalItems: number;
    // };
    links: PaginationLinks;
}

export interface Link {
    href: string;
}

export interface PaginationLinks {
    [key: string]: Link;
    self: Link;
    first: Link;
    last: Link;
    next?: Link;
    prev?: Link;
}
