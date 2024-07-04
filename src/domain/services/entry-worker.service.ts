import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { EntryWorker } from '@domain/entities';
import { DatabaseService } from '@domain/services';

@Injectable()
export class EntryWorkerService extends DatabaseService<EntryWorker> {
    protected readonly entityName = EntryWorker;

    constructor(
        protected readonly em: EntityManager,
        @InjectRepository(EntryWorker) protected readonly repository: EntityRepository<EntryWorker>,
    ) {
        super(em, repository);
    }
}
