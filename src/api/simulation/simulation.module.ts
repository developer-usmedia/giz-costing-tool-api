import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { Worker } from '@database/entities';
import { Simulation } from '@database/entities/simulation.entity';
import { SimulationService } from '@domain/services/simulation.service';
import { WorkerService } from '@domain/services/worker.service';
import { SimulationController } from './controller/simulation.controller';

@Module({
    imports: [
        MikroOrmModule.forFeature([Simulation, Worker]),
        PassportModule,
    ],
    providers: [SimulationService, WorkerService],
    exports: [SimulationService, WorkerService],
    controllers: [SimulationController],
})
export class SimulationModule {}
