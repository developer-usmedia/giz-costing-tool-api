import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';

import { AuthModule } from '@api/modules/auth/auth.module';
import { SimulationModule } from '@api/modules/simulation/simulation.module';
import { UserModule } from '@api/modules/user/user.module';
import { UserAwareInterceptor } from '@api/nestjs/interceptors/user-aware.interceptor';

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
