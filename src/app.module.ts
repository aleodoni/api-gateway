import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { RbacModule } from './rbac/rbac.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProxyrmqModule,
    RbacModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
