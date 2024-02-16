import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { SimulationModule } from './simulations/simulation.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    SimulationModule,
  ],
  exports: [
    UserModule,
    AuthModule,
    SimulationModule,
  ],
})
export class ApiModule {}
