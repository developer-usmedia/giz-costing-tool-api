export interface Link {
    href: string;
    templated?: boolean;
}

export interface Links {
    self: Link;
    first: Link;
    last: Link;
    next?: Link;
    prev?: Link;
}

export interface HalResponse {
    // _embedded?: E = Record<string, any>;
    _links: {
        self: Link;
    };
}

export interface CollectionResponse<E = Record<string, any>> extends HalResponse {
    paging: {
        index: number;
        size: number;
        totalEntities: number;
        totalPages: number;
    };
    _embedded: E;
    _links: Links;
}

export type EntityResponse<E = Record<string, any>> = HalResponse & {
    [K in keyof E]: E[K];
};
