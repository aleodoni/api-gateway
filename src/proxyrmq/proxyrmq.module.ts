import { Module } from '@nestjs/common';
import { ClientProxyMQ } from './client-proxy';

@Module({
  providers: [ClientProxyMQ],
  exports: [ClientProxyMQ],
})
export class ProxyrmqModule {}
