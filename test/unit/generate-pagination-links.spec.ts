import { generatePaginationLinks } from '@api/paging/generate-pagination-links';
import { Sort } from '@api/paging/paging-params';
import { resolveLink } from '@common/utils/link-resolver';

// Mocking the resolveLink function
jest.mock('@common/utils/link-resolver');

const mockResolveLink = resolveLink as jest.MockedFunction<typeof resolveLink>;

describe('generatePaginationLinks', () => {
    const baseUrl = new URL('http://example.com/api/v1/users');
    const totalItems = 100;

    beforeEach(() => {
        // Mock link-resolver implementation 
        mockResolveLink.mockImplementation((url, params) => {
            const queryString = new URLSearchParams(params as Record<string, string>).toString();
            return `${url.toString()}?${queryString}`;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('generates pagination links correctly', () => {
        const paging = { index: 0, size: 10, sort: { field: Sort.ASC } };

        const expectedLinks = {
            self: { href: 'http://example.com/api/v1/users?index=0&size=10&sort=field%2BASC' },
            first: { href: 'http://example.com/api/v1/users?index=0&size=10&sort=field%2BASC' },
            last: { href: 'http://example.com/api/v1/users?index=10&size=10&sort=field%2BASC' },
            next: { href: 'http://example.com/api/v1/users?index=1&size=10&sort=field%2BASC' },
        };

        const result = generatePaginationLinks(baseUrl, totalItems, paging);

        expect(result).toEqual(expectedLinks);
        expect(resolveLink).toHaveBeenCalledTimes(4);
    });

    it('generates pagination links correctly with on a different page than 0', () => {
        const paging = { index: 2, size: 2, sort: { field: Sort.ASC } };

        const expectedLinks = {
            self: { href: 'http://example.com/api/v1/users?index=2&size=2&sort=field%2BASC' },
            first: { href: 'http://example.com/api/v1/users?index=0&size=2&sort=field%2BASC' },
            last: { href: 'http://example.com/api/v1/users?index=50&size=2&sort=field%2BASC' },
            prev: { href: 'http://example.com/api/v1/users?index=1&size=2&sort=field%2BASC' },
            next: { href: 'http://example.com/api/v1/users?index=3&size=2&sort=field%2BASC' },
        };

        const result = generatePaginationLinks(baseUrl, totalItems, paging);

        expect(result).toEqual(expectedLinks);
        expect(resolveLink).toHaveBeenCalledTimes(5);
    });
});
