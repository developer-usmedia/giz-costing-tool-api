import { EntityName, FilterQuery, FindOptions } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import { PagingParams } from '@api/paging/paging-params';
import { toFindOptions } from '@api/paging/to-find-options';
import { toWhereOptions } from '@api/paging/to-where-options';
import { AbstractEntity } from '@domain/entities';

export abstract class DatabaseService<T extends AbstractEntity<T>> {
    protected abstract readonly entityName: EntityName<T>;

    constructor(
        protected readonly em: EntityManager,
        protected readonly repo: EntityRepository<T>,
    ) {}

    public findMany(where?: FilterQuery<T>, options?: FindOptions<T>): Promise<T[]> {
        return this.repo.find(where, options);
    }

    public findManyPaged<P extends string = never>(paging: PagingParams<T>): Promise<[T[], number]> {
        const where = toWhereOptions<T>(paging);
        const find = toFindOptions<T, P>(paging);
        return this.repo.findAndCount(where, find);
    }

    public findOne<P extends string = never>(where?: FilterQuery<T>, options?: FindOptions<T, P>, findOrFail = true): Promise<T> {
        if (findOrFail) {
            return this.repo.findOneOrFail<P>(where, options);
        } else {
            return this.repo.findOne<P>(where, options);
        }
    }

    public findOneByUid<P extends string = never>(id: string, options: FindOptions<T, P> = {}, findOrFail = true): Promise<T> {
        if (findOrFail) {
            return this.repo.findOneOrFail<P>({ id } as FilterQuery<T>, options);
        } else {
            return this.repo.findOne<P>({ id } as FilterQuery<T>, options);
        }
    }

    public count(where: FilterQuery<T>): Promise<number> {
        return this.em.count(this.entityName, where);
    }

    public async persist(entity: T, andFlush = true): Promise<T> {
        this.em.persist(entity);

        if (andFlush) {
            await this.em.flush();
        }

        return entity;
    }

    public async remove(entity: T, andFlush = true): Promise<T> {
        this.em.remove(entity);

        if (andFlush) {
            await this.em.flush();
        }

        return entity;
    }

    public flush(): Promise<void> {
        return this.em.flush();
    }
}
