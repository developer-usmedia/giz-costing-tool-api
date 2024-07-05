import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Entry, EntryWorker } from '@domain/entities';
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

    public async *getBatched(entry: Entry, batchSize: number) {
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const workers = await this.findMany({ _entry: entry } as any, { offset: offset, limit: batchSize });

            if (workers.length > 0) {
                yield workers;
                offset += workers.length;
            }

            hasMore = workers.length === batchSize;
        }
    }
}
