import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository, raw } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';

import { EntryWorker, Scenario, ScenarioWorker } from '@domain/entities';
import { DatabaseService, EntryWorkerService } from '@domain/services';

@Injectable()
export class ScenarioWorkerService extends DatabaseService<ScenarioWorker> {
    protected readonly entityName = ScenarioWorker;
    private readonly logger = new Logger(ScenarioWorkerService.name);

    constructor(
        protected readonly em: EntityManager,
        @InjectRepository(ScenarioWorker) protected readonly repository: EntityRepository<ScenarioWorker>,
        protected readonly entryWorkerService: EntryWorkerService,
    ) {
        super(em, repository);
    }

    public resetSpecificationsForWorkers(scenarioId: string): Promise<void> {
        const qb = this.repository.qb('sw')
            .update(raw('sw.specs_remuneration_increase = null'))
            .where('scenario_id = ?', [scenarioId]);

        this.logger.log(qb.getQuery());
        return Promise.resolve();

        // return qb.execute();
        return Promise.resolve();
    }

    public resetDistributionForWorkers(scenarioId: string): Promise<void> {
        const qb = this.repository.qb('sw')
            .update(raw(
                'sw.distro_base_wage = null, ' +
                'sw.distro_bonuses = null, ' +
                'sw.distro_ikb = null, ' +
                'sw.distro_ikb_housing = null, ' +
                'sw.distro_ikb_food = null, ' +
                'sw.distro_ikb_transport = null, ' +
                'sw.distro_ikb_healthcare = null, ' +
                'sw.distro_ikb_childcare = null, ' +
                'sw.distro_ikb_child_education = null'
            ))
            .where('sw.scenario_id = ?', [scenarioId]);

        this.logger.log(qb.getQuery());

        // return qb.execute();
        return Promise.resolve();
    }

    /* eslint-disable @typescript-eslint/no-unsafe-argument */
    public createMissingWorkers(scenarioId: string): Promise<void> {
        // Gotta raw dog SQL
        // INSERT INTO ScenarioWorker sw (scenario_id, original_id)
        // SELECT ?, id FROM EntryWorker s
        // WHERE s.id NOT IN (SELECT original_id FROM scenario_worker );

        // const knex = this.em.getKnex();
        // const qb = knex.from(knex.raw('?? (??, ??)', ['orders', 'user_id', 'email']))
        //     .insert(function() {
        //         this.from('users AS u')
        //             .where('u.username', 'jdoe')
        //             .select('user_id', knex.raw('? AS ??', ['jdoe@gmail.com', 'email']))
        //     });
        // console.log(qb.toString());

        const notIn = this.em.createQueryBuilder(ScenarioWorker, 'sw')
            .select('sw.original_id')
            .where('sw.scenario_id = ?', [scenarioId]);

        const insert = this.em.createQueryBuilder(EntryWorker, 'ew')
            .select(raw('?, ew.id', [scenarioId]))
            .where({ id: { $nin: notIn.getKnexQuery() } });


        const qb = this.repository.qb('sw')
            .from(raw('(scenario_id, original_id)')) // , ['scenario_id', 'original_id']
            .insert(insert.getKnexQuery());

        this.logger.log(qb.getQuery());

        // const qb = this.repository.qb('sw')
        //     .insert(raw(''))
        //     .where('scenario_id = ?', [scenarioId]);

        // return qb.execute();
        return Promise.resolve();
    }
    /* eslint-enable @typescript-eslint/no-unsafe-argument */

    async importWorkers(scenario: Scenario, batchSize = 20) {
        /* eslint-disable @typescript-eslint/no-unsafe-argument */
        for await (const batch of this.entryWorkerService.getBatched({ _entry: scenario.entry } as any, batchSize)) {
            const scenarioWorkers = [];

            for (const entryWorker of batch) {
                const scenarioWorker = new ScenarioWorker({
                    scenario: scenario,
                    worker: entryWorker,
                });
                scenarioWorkers.push(scenarioWorker);
            }

            await this.repository.insertMany(scenarioWorkers);
        }
    }
}
