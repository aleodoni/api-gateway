import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxyMQ } from 'src/proxyrmq/client-proxy';
import { userConstants } from '../common/constants/user.constants';
import { systemConstants } from '../common/constants/system.constants';
import { UserSystemDto } from './dtos/user-system.dto';
import { RbacService } from './rbac.service';
import { CheckPermissionDto } from './dtos/check-permission.dto';

@Controller('api/v1/rbac')
export class RbacController {
  private readonly logger = new Logger(RbacController.name);

  constructor(
    private clientProxyMQ: ClientProxyMQ,
    private rbacService: RbacService,
  ) {}

  private clientUserProxy = this.clientProxyMQ.getClientProxyUserInstance();
  private clientAccessProxy = this.clientProxyMQ.getClientProxyAccessInstance();

  @Get('/:userId/:systemId')
  @UsePipes(ValidationPipe)
  async getRbacUser(@Param() params: UserSystemDto): Promise<any> {
    this.logger.log(`params: ${JSON.stringify(params)}`);

    // Deve pesquisar o usuário para ver se existe
    const user = await this.clientUserProxy
      .send('search-user', params.userId)
      .toPromise();

    if (!user) {
      throw new BadRequestException(userConstants.USER_NOT_FOUND);
    }

    // Deve pesquisar o sistema para ver se existe
    const system = await this.clientAccessProxy
      .send('search-system', params.systemId)
      .toPromise();

    if (!system) {
      throw new BadRequestException(systemConstants.SYSTEM_NOT_FOUND);
    }

    this.logger.log(JSON.stringify(system));

    // Se usuário e sistema existem, busca permissões do usuário no sistema
  }

  @Post('check-permission')
  @UsePipes(ValidationPipe)
  async checkPermission(
    @Body() checkPermissionDto: CheckPermissionDto,
  ): Promise<boolean> {
    return this.rbacService.checkPermission(checkPermissionDto);
  }
}
