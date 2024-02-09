/**
 * Takes an url and set the entries of params object as search params on the URL
 *
 * http://localhost:8080/api/v1/users?index=0
 * {
 * index: 2
 * sort: "desc"
 * }
 *
 * result: http://localhost:8080/api/v1/users?index=2&sort=desc
 *
 * @param href url to set searchParams on
 * @param params search params to set
 * @returns source url with search params set according to params object
 */
export const resolveLink = (url: URL, params?: { [key: string]: string | number | boolean }): string => {
    if (!params) return url.toString();

    for (const key of Object.keys(params)) {
        const value = params[key];
        if (typeof value === 'string' && !value) {
            continue;
        }

        url.searchParams.set(key, value.toString());
    }

    return encodeURI(url.toString());
};
