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
import { CreateUserRoleDto } from './dtos/create-user-role.dto';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UserRole } from './interfaces/user-role.interface';
import { roleConstants } from '../../common/constants/role.constants';
import { System } from '../system/interfaces/system.interface';
import { systemConstants } from 'src/common/constants/system.constants';
import { Role } from '../role/interfaces/role.interface';
import { userRoleConstants } from 'src/common/constants/user-role.constants';

@Controller('api/v1/admin/user-role')
export class UserRoleController {
  private readonly logger = new Logger(UserRoleController.name);

  constructor(private clientProxyMQ: ClientProxyMQ) {}

  private clientAccessProxy = this.clientProxyMQ.getClientProxyAccessInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createUserRole(@Body() createUserRoleDto: CreateUserRoleDto) {
    // Verify if role with roleId exists
    const roleExist: Role = await this.clientAccessProxy
      .send('search-role', createUserRoleDto.roleId)
      .toPromise();

    if (!roleExist) {
      throw new BadRequestException(roleConstants.ROLE_NOT_FOUND);
    }

    this.logger.log(`createUserRoleDto: ${JSON.stringify(createUserRoleDto)}`);

    this.clientAccessProxy.emit('create-user-role', createUserRoleDto);
  }

  @Put('/:userRoleId')
  @UsePipes(ValidationPipe)
  async updateUserRole(
    @Param('userRoleId', ParseIntPipe) userRoleId: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    // Verify if userRole with userRoleId exists
    const userRoleExist: UserRole = await this.clientAccessProxy
      .send('search-user-role', userRoleId)
      .toPromise();

    if (!userRoleExist) {
      throw new BadRequestException(userRoleConstants.USER_ROLE_NOT_FOUND);
    }

    this.logger.log(
      `Updating userRole with id: ${userRoleId} and updateUserRoleDto: ${JSON.stringify(
        updateUserRoleDto,
      )}`,
    );

    this.clientAccessProxy.emit('update-user-role', {
      userRoleId,
      updateUserRoleDto,
    });
  }

  @Delete('/:userRoleId')
  @UsePipes(ValidationPipe)
  async deleteUserRole(@Param('userRoleId', ParseIntPipe) userRoleId: number) {
    // Verify if role with roleId exists
    const userRoleExist: UserRole = await this.clientAccessProxy
      .send('search-user-role', userRoleId)
      .toPromise();

    if (!userRoleExist) {
      throw new BadRequestException(userRoleConstants.USER_ROLE_NOT_FOUND);
    }

    this.logger.log(
      `Deleting (logical delete) userRole with id: ${userRoleId}`,
    );

    this.clientAccessProxy.emit('delete-user-role', userRoleId);
  }

  @Get('/:userId')
  @UsePipes(ValidationPipe)
  async getAllUserRoles(@Param('userId', ParseIntPipe) userId: number) {
    return this.clientAccessProxy.send('get-all-user-roles', userId);
  }
}
