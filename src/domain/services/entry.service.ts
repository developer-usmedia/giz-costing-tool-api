import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Entry } from '@domain/entities';
import { BaseService } from '@domain/services/base/base.service';

@Injectable()
export class EntryService extends BaseService<Entry> {
    protected readonly entityName = Entry;

    constructor(
        protected readonly em: EntityManager,
        @InjectRepository(Entry) protected readonly repository: EntityRepository<Entry>,
    ) {
        super(em, repository);
    }
}
