import { Module } from '@nestjs/common';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [ProxyrmqModule],
  controllers: [AuthController],
})
export class AuthModule {}
