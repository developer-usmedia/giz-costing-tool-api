export type EntityResponse<I extends string, T> = {
    [key in I]: T;
};

export type PagedEntityResponse<I extends string, T> = {
    [key in I]: T[];
} & HateoasResponse;

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
