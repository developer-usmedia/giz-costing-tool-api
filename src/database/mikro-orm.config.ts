import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { join } from 'path';

import { User } from './entities/user.entity';

export const entities = [
    User,
];

export const mikroOrmOpts: MikroOrmModuleSyncOptions = {
  debug: process.env.NODE_ENV !== 'production',
  driver: PostgreSqlDriver,
  entities: entities,
  migrations: {
    transactional: true,
    disableForeignKeys: false,
    path: join(__dirname, 'migrations'),
  },
  extensions: [Migrator, SeedManager],
  seeder: {
    path: join(__dirname, 'seeders'),
    pathTs: join(__dirname, 'seeders'),
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
};

export default mikroOrmOpts;