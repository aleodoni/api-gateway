import { Module } from '@nestjs/common';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';

@Module({
  imports: [ProxyrmqModule],
  controllers: [RbacController],
  providers: [RbacService],
})
export class RbacModule {}
