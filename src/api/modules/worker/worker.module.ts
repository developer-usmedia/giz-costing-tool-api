import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';

import { DomainModule } from '@domain/domain.module';
import { Worker } from '@domain/entities/worker.entity';

@Module({
    imports: [DomainModule, MikroOrmModule.forFeature([Worker])],
    providers: [],
    exports: [],
    controllers: [],
})
export class WorkerModule {}
