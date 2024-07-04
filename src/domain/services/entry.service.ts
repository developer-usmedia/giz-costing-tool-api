import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Entry } from '@domain/entities';
import { DatabaseService } from '@domain/services';

@Injectable()
export class EntryService extends DatabaseService<Entry> {
    protected readonly entityName = Entry;

    constructor(
        protected readonly em: EntityManager,
        @InjectRepository(Entry) protected readonly repository: EntityRepository<Entry>,
    ) {
        super(em, repository);
    }
}
