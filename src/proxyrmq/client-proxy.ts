import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientProxyMQ {
  constructor(private configService: ConfigService) {}

  getClientProxyInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`${this.configService.get<string>('RABBITMQ_URL')}`],
        queue: 'auth',
      },
    });
  }
}
