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
import { Permission } from './interfaces/permission.interface';
import { roleConstants } from '../../common/constants/role.constants';
import { System } from '../system/interfaces/system.interface';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { permissionConstants } from 'src/common/constants/permission.constants';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { Role } from '../role/interfaces/role.interface';

@Controller('api/v1/admin/permission')
export class PermissionController {
  private readonly logger = new Logger(PermissionController.name);

  constructor(private clientProxyMQ: ClientProxyMQ) {}

  private clientAccessProxy = this.clientProxyMQ.getClientProxyAccessInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    // Verify if role with roleId exists
    const roleExist: Role = await this.clientAccessProxy
      .send('search-role', createPermissionDto.roleId)
      .toPromise();

    if (!roleExist) {
      throw new BadRequestException(permissionConstants.PERMISSION_NOT_FOUND);
    }

    this.logger.log(
      `createPermissionDto: ${JSON.stringify(createPermissionDto)}`,
    );

    this.clientAccessProxy.emit('create-permission', createPermissionDto);
  }

  @Put('/:permissionID')
  @UsePipes(ValidationPipe)
  async updatePermission(
    @Param('permissionId', ParseIntPipe) permissionId: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    // Verify if permission with permissionId exists
    const permissionExist: Permission = await this.clientAccessProxy
      .send('search-permission', permissionId)
      .toPromise();

    if (!permissionExist) {
      throw new BadRequestException(permissionConstants.PERMISSION_NOT_FOUND);
    }

    this.logger.log(
      `Updating role with id: ${permissionId} and updatePermissionDto: ${JSON.stringify(
        updatePermissionDto,
      )}`,
    );

    this.clientAccessProxy.emit('update-permission', {
      permissionId,
      updatePermissionDto,
    });
  }

  @Delete('/:permissionId')
  @UsePipes(ValidationPipe)
  async deleteRole(@Param('permissionId', ParseIntPipe) permissionId: number) {
    // Verify if permission with permissionId exists
    const permissionExist: Permission = await this.clientAccessProxy
      .send('search-permission', permissionId)
      .toPromise();

    if (!permissionExist) {
      throw new BadRequestException(permissionConstants.PERMISSION_NOT_FOUND);
    }

    this.logger.log(
      `Deleting (logical delete) permission with id: ${permissionId}`,
    );

    this.clientAccessProxy.emit('delete-permission', permissionId);
  }

  @Get('/:roleId')
  @UsePipes(ValidationPipe)
  async getAllPermissions(@Param('roleId', ParseIntPipe) roleId: number) {
    // Verify if role with roleId exists
    const roleExist: System = await this.clientAccessProxy
      .send('search-role', roleId)
      .toPromise();

    if (!roleExist) {
      throw new BadRequestException(roleConstants.ROLE_NOT_FOUND);
    }

    return this.clientAccessProxy.send('get-all-permissions', roleId);
  }
}
