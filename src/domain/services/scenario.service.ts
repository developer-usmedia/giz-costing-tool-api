import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Scenario } from '@domain/entities';
import { BaseService } from '@domain/services/base/base.service';

@Injectable()
export class ScenarioService extends BaseService<Scenario> {
    protected readonly entityName = Scenario;

    constructor(
        protected readonly em: EntityManager,
        @InjectRepository(Scenario) protected readonly repository: EntityRepository<Scenario>,
    ) {
        super(em, repository);
    }
}
