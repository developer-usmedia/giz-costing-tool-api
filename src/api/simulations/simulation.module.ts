import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { Simulation } from '@database/entities/simulation.entity';
import { SimulationService } from '@domain/services/simulation.service';
import { SimulationController } from './controller/simulation.controller';

@Module({
    imports: [
        MikroOrmModule.forFeature([Simulation]),
        PassportModule,
    ],
    providers: [SimulationService],
    exports: [SimulationService],
    controllers: [SimulationController],
})
export class SimulationModule {}
