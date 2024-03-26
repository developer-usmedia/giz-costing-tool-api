import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Simulation } from '@domain/entities/simulation.entity';
import { BaseService } from '@domain/services/base/base.service';

@Injectable()
export class SimulationService extends BaseService<Simulation> {
    protected readonly entityName = Simulation;

    constructor(
        protected readonly em: EntityManager,
        @InjectRepository(Simulation) protected readonly repository: EntityRepository<Simulation>,
    ) {
        super(em, repository);
    }
}
