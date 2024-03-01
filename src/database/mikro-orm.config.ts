import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { NotFoundException } from '@nestjs/common';
import { join } from 'path';

import { environment } from '@common/environment/environment';
import { SimulationBenchmark, SimulationFacility, WorkerIKB } from './embeddables';
import { VerificationCode } from './embeddables/verification-code.embeddable';
import { Benchmark, Simulation, User, Worker } from './entities';
import { GizNamingStrategy, validateMigrationName } from './naming-strategy';

export const entities = [
    User,
    VerificationCode,
    Simulation,
    SimulationBenchmark,
    SimulationFacility,
    Worker,
    WorkerIKB,
    Benchmark,
];

export const mikroOrmOpts: MikroOrmModuleSyncOptions = {
    driver: PostgreSqlDriver,
    host: environment.db.host,
    port: environment.db.port,
    dbName: environment.db.name,
    user: environment.db.user,
    password: environment.db.password,
    pool: {
        max: 3,
        acquireTimeoutMillis: 1000,
    },
    entities: entities,
    migrations: {
        tableName: 'giz_migration',
        transactional: true,
        disableForeignKeys: false,
        path: join(__dirname, 'migrations'),
        fileName: validateMigrationName,
    },
    namingStrategy: GizNamingStrategy,
    extensions: [Migrator, SeedManager],
    seeder: {
        path: join(__dirname, 'seeders'),
        pathTs: join(__dirname, 'seeders'),
        defaultSeeder: 'DatabaseSeeder',
        glob: '!(*.d).{js,ts}',
        emit: 'ts',
        fileName: (className: string) => className,
    },
    timezone: '+00:00',
    forceUtcTimezone: true,
    debug: environment.isLocal(),
    findOneOrFailHandler: (entity: string) => {
        return new NotFoundException(`${entity} not found`);
    },
};

export default mikroOrmOpts;
