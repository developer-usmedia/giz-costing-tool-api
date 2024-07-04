import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { NotFoundException } from '@nestjs/common';
import { join } from 'path';

import { environment } from 'environment';
import { UserAwareArgs } from '@domain/interceptors';
import { DatabaseNamingStrategy, migrationFileName, seederFileName } from '@domain/database';
import {
    Benchmark,
    Entry,
    EntryBenchmark,
    EntryBuyer,
    EntryFacility,
    EntryPayroll,
    EntryWorker,
    EntryWorkerRemuneration,
    Scenario,
    ScenarioDistribution,
    ScenarioPayroll,
    ScenarioSpecification,
    ScenarioWorker,
    ScenarioWorkerDistribution,
    ScenarioWorkerSpecification,
    TwoFactor,
    User,
    VerificationCode,
} from '@domain/entities';

export const entities = [
    Benchmark,
    Entry,
    EntryBenchmark,
    EntryBuyer,
    EntryFacility,
    EntryPayroll,
    EntryWorker,
    EntryWorkerRemuneration,
    Scenario,
    ScenarioDistribution,
    ScenarioPayroll,
    ScenarioSpecification,
    ScenarioWorker,
    ScenarioWorkerDistribution,
    ScenarioWorkerSpecification,
    TwoFactor,
    User,
    VerificationCode,
];

export enum MikroFilters {
    USER_AWARE = 'user-aware',
}

export const mikroOrmOpts: MikroOrmModuleSyncOptions = {
    driver: PostgreSqlDriver,
    metadataCache: { pretty: environment.api.isLocal, enabled: environment.api.isLocal },
    host: environment.db.host,
    port: environment.db.port,
    dbName: environment.db.name,
    user: environment.db.user,
    password: environment.db.password,
    pool: {
        max: 3,
        acquireTimeoutMillis: 5000,
    },
    entities: entities,
    migrations: {
        tableName: 'giz_migration',
        transactional: true,
        disableForeignKeys: false,
        path: join(__dirname, 'migrations'),
        fileName: migrationFileName,
        snapshotName: 'db-schema',
    },
    namingStrategy: DatabaseNamingStrategy,
    extensions: [Migrator, SeedManager],
    seeder: {
        path: join(__dirname, 'seeders'),
        pathTs: join(__dirname, 'seeders'),
        defaultSeeder: 'DatabaseSeeder',
        glob: '!(*.d).{js,ts}',
        emit: 'ts',
        fileName: seederFileName,
    },
    timezone: '+00:00',
    forceUtcTimezone: true,
    debug: environment.api.isLocal,
    findOneOrFailHandler: (entity: string) => {
        return new NotFoundException(`${entity} not found`);
    },
    filters: {
        [MikroFilters.USER_AWARE]: {
            cond: (args: UserAwareArgs) => (args.enable ? { _userId: args.userId } : {}),
            entity: [ 'Entry' ],
        },
    },
};

export default mikroOrmOpts;
