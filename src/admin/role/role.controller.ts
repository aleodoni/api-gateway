import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxyMQ } from 'src/proxyrmq/client-proxy';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { Role } from './interfaces/role.interface';
import { roleConstants } from '../../common/constants/role.constants';
import { System } from '../system/interfaces/system.interface';
import { systemConstants } from 'src/common/constants/system.constants';

@Controller('api/v1/admin/role')
export class RoleController {
  private readonly logger = new Logger(RoleController.name);

  constructor(private clientProxyMQ: ClientProxyMQ) {}

  private clientAccessProxy = this.clientProxyMQ.getClientProxyAccessInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    // Verify if system with systemId exists
    const systemExist: System = await this.clientAccessProxy
      .send('search-system', createRoleDto.systemId)
      .toPromise();

    if (!systemExist) {
      throw new BadRequestException(systemConstants.SYSTEM_NOT_FOUND);
    }

    this.logger.log(`createRoleDto: ${JSON.stringify(createRoleDto)}`);

    this.clientAccessProxy.emit('create-role', createRoleDto);
  }

  @Put('/:roleId')
  @UsePipes(ValidationPipe)
  async updateRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    // Verify if role with roleId exists
    const roleExist: Role = await this.clientAccessProxy
      .send('search-role', roleId)
      .toPromise();

    if (!roleExist) {
      throw new BadRequestException(roleConstants.ROLE_NOT_FOUND);
    }

    this.logger.log(
      `Updating role with id: ${roleId} and updateRoleDto: ${JSON.stringify(
        updateRoleDto,
      )}`,
    );

    this.clientAccessProxy.emit('update-role', { roleId, updateRoleDto });
  }

  @Delete('/:roleId')
  @UsePipes(ValidationPipe)
  async deleteRole(@Param('roleId', ParseIntPipe) roleId: number) {
    // Verify if role with roleId exists
    const roleExist: Role = await this.clientAccessProxy
      .send('search-role', roleId)
      .toPromise();

    if (!roleExist) {
      throw new BadRequestException(roleConstants.ROLE_NOT_FOUND);
    }

    this.logger.log(`Deleting (logical delete) role with id: ${roleId}`);

    this.clientAccessProxy.emit('delete-role', roleId);
  }

  @Get('/:systemId')
  @UsePipes(ValidationPipe)
  async getAllRoles(@Param('systemId', ParseIntPipe) systemId: number) {
    // Verify if system with systemId exists
    const systemExist: System = await this.clientAccessProxy
      .send('search-system', systemId)
      .toPromise();

    if (!systemExist) {
      throw new BadRequestException(systemConstants.SYSTEM_NOT_FOUND);
    }

    return this.clientAccessProxy.send('get-all-roles', systemId);
  }
}
