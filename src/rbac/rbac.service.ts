import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { roleConstants } from 'src/common/constants/role.constants';
import { systemConstants } from 'src/common/constants/system.constants';
import { userConstants } from 'src/common/constants/user.constants';
import { ClientProxyMQ } from 'src/proxyrmq/client-proxy';
import { CheckPermissionDto } from './dtos/check-permission.dto';

@Injectable()
export class RbacService {
  private readonly logger = new Logger(RbacService.name);

  constructor(private clientProxyMQ: ClientProxyMQ) {}

  private clientUserProxy = this.clientProxyMQ.getClientProxyUserInstance();
  private clientAccessProxy = this.clientProxyMQ.getClientProxyAccessInstance();

  async checkPermission(
    checkPermissionDto: CheckPermissionDto,
  ): Promise<boolean> {
    this.logger.log(
      `checkPermissionDto: ${JSON.stringify(checkPermissionDto)}`,
    );

    const checkUserValid = await this.clientUserProxy
      .send('search-user', checkPermissionDto.userId)
      .toPromise();

    this.logger.log(`usuario: ${JSON.stringify(checkUserValid)}`);

    if (!checkUserValid) {
      throw new BadRequestException(userConstants.USER_NOT_FOUND);
    }

    const checkSystemValid = await this.clientAccessProxy
      .send('search-system-name', checkPermissionDto.system)
      .toPromise();

    if (!checkSystemValid) {
      throw new BadRequestException(systemConstants.SYSTEM_NOT_FOUND);
    }

    this.logger.log(`system: ${JSON.stringify(checkSystemValid)}`);

    const checkRoleValid = await this.clientAccessProxy
      .send('get-role-by-system-name-and-role-name', {
        systemName: checkPermissionDto.system,
        roleNames: checkPermissionDto.roles,
      })
      .toPromise();

    if (!checkRoleValid) {
      throw new BadRequestException(roleConstants.ROLE_NOT_FOUND);
    }

    const userRole = await this.clientAccessProxy
      .send('get-user-role-by-roleid-and-userid', {
        roleId: checkRoleValid,
        userId: Number(checkPermissionDto.userId),
      })
      .toPromise();

    if (userRole) {
      return true;
    }

    return false;
  }
}
