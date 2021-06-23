import { Injectable, Logger } from '@nestjs/common';
import { ClientProxyMQ } from 'src/proxyrmq/client-proxy';
import { LoginDto } from './dtos/login.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private clientProxyMQ: ClientProxyMQ) {}

  private clientAuthProxy = this.clientProxyMQ.getClientProxyUserInstance();

  async authenticate(loginDto: LoginDto): Promise<User> {
    this.logger.log(`loginDto: ${JSON.stringify(loginDto)}`);

    const user: User = await this.clientAuthProxy
      .send('authenticate', loginDto)
      .toPromise();

    this.logger.log(`user: ${JSON.stringify(user)}`);

    return user;
  }

  async validate(token: string): Promise<boolean> {
    this.logger.log(`token: ${JSON.stringify(token)}`);

    const splitted = token.split(' ');

    if (splitted.length > 1 && splitted[0] === 'Bearer') {
      return await this.clientAuthProxy
        .send('validate', splitted[1])
        .toPromise();
    } else {
      return await this.clientAuthProxy
        .send('validate', splitted[0])
        .toPromise();
    }
  }
}
