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
import { CreateSystemDto } from './dtos/create-system.dto';
import { UpdateSystemDto } from './dtos/update-system.dto';
import { systemConstants } from '../../common/constants/system.constants';
import { System } from './interfaces/system.interface';

@Controller('api/v1/admin/system')
export class SystemController {
  private readonly logger = new Logger(SystemController.name);

  constructor(private clientProxyMQ: ClientProxyMQ) {}

  private clientAccessProxy = this.clientProxyMQ.getClientProxyAccessInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createSystem(@Body() createSystemDto: CreateSystemDto) {
    const systemName = await this.clientAccessProxy
      .send('search-system-name', createSystemDto.name)
      .toPromise();

    if (systemName) {
      throw new BadRequestException(systemConstants.SYSTEM_NAME_EXISTS);
    }
    this.logger.log(`createSystemDto: ${JSON.stringify(createSystemDto)}`);

    this.clientAccessProxy.emit('create-system', createSystemDto);
  }

  @Put('/:systemId')
  @UsePipes(ValidationPipe)
  async updateSystem(
    @Param('systemId', ParseIntPipe) systemId: number,
    @Body() updateSystemDto: UpdateSystemDto,
  ) {
    // Verify if system with systemId exists
    const systemExist: System = await this.clientAccessProxy
      .send('search-system', systemId)
      .toPromise();

    if (!systemExist) {
      throw new BadRequestException(systemConstants.SYSTEM_NOT_FOUND);
    }

    // Verify is there is a system with this name
    const systemNameExist: System = await this.clientAccessProxy
      .send('search-system-name', updateSystemDto.name)
      .toPromise();

    if (systemNameExist && systemNameExist.id !== systemExist.id) {
      throw new BadRequestException(systemConstants.SYSTEM_NAME_EXISTS);
    }

    this.logger.log(
      `Updating system with id: ${systemId} and updateSystemDto: ${JSON.stringify(
        updateSystemDto,
      )}`,
    );

    this.clientAccessProxy.emit('update-system', { systemId, updateSystemDto });
  }

  @Delete('/:systemId')
  @UsePipes(ValidationPipe)
  async deleteSystem(@Param('systemId', ParseIntPipe) systemId: number) {
    // Verify if system with systemId exists
    const systemExist: System = await this.clientAccessProxy
      .send('search-system', systemId)
      .toPromise();

    if (!systemExist) {
      throw new BadRequestException(systemConstants.SYSTEM_NOT_FOUND);
    }

    this.logger.log(`Deleting (logical delete) system with id: ${systemId}`);

    this.clientAccessProxy.emit('delete-system', systemId);
  }

  @Get()
  async getAllSystems() {
    return this.clientAccessProxy.send('get-all-systems', '');
  }
}
