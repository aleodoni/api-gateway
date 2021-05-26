import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxyMQ } from 'src/proxyrmq/client-proxy';
import { LoginDto } from './dtos/login.dto';

@Controller('api/v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private clientProxyMQ: ClientProxyMQ) {}

  private clientAdminBackend = this.clientProxyMQ.getClientProxyInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async authenticate(@Body() loginDto: LoginDto) {
    this.logger.log(`loginDto: ${JSON.stringify(loginDto)}`);

    const user = await this.clientAdminBackend
      .send('authenticate', loginDto)
      .toPromise();

    this.logger.log(`user: ${JSON.stringify(user)}`);
    return user;
  }
}
