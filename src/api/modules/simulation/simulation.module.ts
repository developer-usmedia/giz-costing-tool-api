import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { SimulationController } from '@api/modules/simulation/controller/simulation.controller';
import { Simulation } from '@domain/entities/simulation.entity';
import { User } from '@domain/entities/user.entity';
import { Worker } from '@domain/entities/worker.entity';
import { SimulationService } from '@domain/services/simulation.service';
import { UserService } from '@domain/services/user.service';
import { WorkerService } from '@domain/services/worker.service';

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
