import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { ScenarioWorker } from '@domain/entities/scenario-worker.entity';
import { BaseService } from '@domain/services/base/base.service';

@Injectable()
export class ScenarioWorkerService extends BaseService<ScenarioWorker> {
    protected readonly entityName = ScenarioWorker;

    constructor(
        protected readonly em: EntityManager,
        @InjectRepository(ScenarioWorker) protected readonly repository: EntityRepository<ScenarioWorker>,
    ) {
        super(em, repository);
    }
}
