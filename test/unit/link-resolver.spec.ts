import { resolveLink } from '@common/utils/link-resolver';

describe('utils/resolveLink', () => {
    test('should return the original URL when no params are provided', () => {
        const url = new URL('http://localhost:8080/api/v1/users');
        expect(resolveLink(url)).toBe('http://localhost:8080/api/v1/users');
    });

    test('should add search params to the URL', () => {
        const url = new URL('http://localhost:8080/api/v1/users?index=0');
        const params = {
            index: 2,
            sort: 'desc',
        };
        expect(resolveLink(url, params)).toBe('http://localhost:8080/api/v1/users?index=2&sort=desc');
    });

    test('should handle boolean values in params', () => {
        const url = new URL('http://localhost:8080/api/v1/users');
        const params = {
            isActive: true,
            isAdmin: false,
        };
        expect(resolveLink(url, params)).toBe('http://localhost:8080/api/v1/users?isActive=true&isAdmin=false');
    });

    test('should handle numeric values in params', () => {
        const url = new URL('http://localhost:8080/api/v1/users');
        const params = {
            page: 1,
            pageSize: 10,
        };
        expect(resolveLink(url, params)).toBe('http://localhost:8080/api/v1/users?page=1&pageSize=10');
    });

    test('should handle mixed types of values in params', () => {
        const url = new URL('http://localhost:8080/api/v1/users');
        const params = {
            name: 'John Doe',
            age: 30,
            isActive: true,
        };
        expect(resolveLink(url, params)).toBe('http://localhost:8080/api/v1/users?name=John+Doe&age=30&isActive=true');
    });

    test('should handle mixed and empty types of values in params', () => {
        const url = new URL('http://localhost:8080/api/v1/users');
        const params = {
            index: 0,
            sort: '',
            pageSize: 10,
        };
        expect(resolveLink(url, params)).toBe('http://localhost:8080/api/v1/users?index=0&pageSize=10');
    });
});
