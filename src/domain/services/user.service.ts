import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { User } from '@domain/entities/user.entity';
import { BaseService } from '@domain/services/base/base.service';

@Injectable()
export class UserService extends BaseService<User> {
    protected readonly entityName = User;

    constructor(
        protected readonly em: EntityManager,
        @InjectRepository(User) protected readonly repository: EntityRepository<User>,
    ) {
        super(em, repository);
    }
}
