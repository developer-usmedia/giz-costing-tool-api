import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { User, Worker } from '@database/entities';
import { Simulation } from '@database/entities/simulation.entity';
import { SimulationService } from '@domain/services/simulation.service';
import { UserService } from '@domain/services/user.service';
import { WorkerService } from '@domain/services/worker.service';
import { SimulationController } from './controller/simulation.controller';

@Module({
    imports: [
        MikroOrmModule.forFeature([Simulation, Worker, User]),
        PassportModule,
    ],
    providers: [SimulationService, WorkerService, UserService],
    exports: [SimulationService, WorkerService],
    controllers: [SimulationController],
})
export class SimulationModule {}
