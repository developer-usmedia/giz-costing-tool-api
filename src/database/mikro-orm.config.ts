import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { NotFoundException } from '@nestjs/common';
import { join } from 'path';

import { UserAwareArgs } from '@api/nestjs/interceptors/user-aware.interceptor';
import { environment } from '@app/environment';
import { GizNamingStrategy } from '@database/naming/database.naming-strategy';
import { SimulationBenchmark } from '@domain/embeddables/simulation-benchmark.embed';
import { SimulationFacility } from '@domain/embeddables/simulation-facility.embed';
import { VerificationCode } from '@domain/embeddables/verification-code.embed';
import { WorkerIKB } from '@domain/embeddables/worker-ikb.embed';
import { Benchmark } from '@domain/entities/benchmark.entity';
import { Simulation } from '@domain/entities/simulation.entity';
import { User } from '@domain/entities/user.entity';
import { Worker } from '@domain/entities/worker.entity';

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

export enum MikroFilters {
    USER_AWARE = 'user-aware',
}

export const mikroOrmOpts: MikroOrmModuleSyncOptions = {
    metadataCache: { pretty: environment.api.isLocal, enabled: true },
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
        fileName: (timestamp: string, name?: string) => {
            if (!name) {
                throw new Error('Specify migration name via `mikro-orm migration:create --name=...`');
            }
        
            return `Migration${timestamp}_${name}`;
        },
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
    debug: environment.api.isLocal,
    findOneOrFailHandler: (entity: string) => {
        return new NotFoundException(`${entity} not found`);
    },
    filters: {
        [MikroFilters.USER_AWARE]: {
            cond: (args: UserAwareArgs) => (args.enable ? { _user: args.userId } : {}),
            entity: [ 'Simulation' ],
        },
    },
};

export default mikroOrmOpts;
