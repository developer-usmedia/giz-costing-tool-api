import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';

import { AuthModule } from '@api/modules/auth/auth.module';
import { SimulationModule } from '@api/modules/simulation/simulation.module';
import { UserModule } from '@api/modules/user/user.module';
import { UserAwareInterceptor } from '@api/nestjs/interceptors/user-aware.interceptor';
import { WorkerModule } from './modules/worker/worker.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    SimulationModule,
    WorkerModule,
  ],
  exports: [
    UserModule,
    AuthModule,
    SimulationModule,
    WorkerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UserAwareInterceptor,
    },
  ],
})
export class ApiModule {}
