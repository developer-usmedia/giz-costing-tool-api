import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { EntryWorker } from '@domain/entities';
import { BaseService } from '@domain/services/base/base.service';

@Injectable()
export class EntryWorkerService extends BaseService<EntryWorker> {
    protected readonly entityName = EntryWorker;

    constructor(
        protected readonly em: EntityManager,
        @InjectRepository(EntryWorker) protected readonly repository: EntityRepository<EntryWorker>,
    ) {
        super(em, repository);
    }
}
