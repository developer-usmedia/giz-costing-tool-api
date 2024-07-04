import { Controller, Get } from '@nestjs/common';

import { environment } from 'environment';
import { USER_LINKS } from '@api/dto/user.links';
import { ENTRY_LINKS } from '@api/dto/entry.links';

@Controller()
export class IndexController {
    @Get('/')
    public index() {
        return {
            _links: {
                self: { href: `${ environment.api.url }/` },
                users: USER_LINKS.users,
                entries: ENTRY_LINKS.entries,
            },
        };
    }
}
