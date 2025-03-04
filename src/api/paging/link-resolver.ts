import { parseTemplate } from 'url-template';
import { Link } from './paging-response';

export const resolveLink = (link: Link, params?: { [key: string]: string | number | boolean }): string => {
    if (link.templated) {
        const template = parseTemplate(link.href);
        return template.expand(params || {});
    }

    return link.href;
};
