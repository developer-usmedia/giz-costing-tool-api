import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Worker } from '@database/entities';
import { BaseService } from './base/base.service';

@Injectable()
export class WorkerService extends BaseService<Worker> {
    protected readonly entityName = Worker;

    constructor(
        protected readonly em: EntityManager,
        @InjectRepository(Worker) protected readonly repository: EntityRepository<Worker>,
    ) {
        super(em, repository);
    }
}
