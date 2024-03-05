import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';

import { AuthModule } from './auth/auth.module';
import { UserAwareInterceptor } from './interceptors/user-aware.interceptor';
import { SimulationModule } from './simulation/simulation.module';
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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UserAwareInterceptor,
    },
  ],
})
export class ApiModule {}
