import { Module } from '@nestjs/common';
import { SystemController } from './system/system.controller';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { RoleController } from './role/role.controller';
import { PermissionController } from './permission/permission.controller';
import { UserRoleController } from './user-role/user-role.controller';

@Module({
  imports: [ProxyrmqModule],
  controllers: [
    SystemController,
    RoleController,
    PermissionController,
    UserRoleController,
  ],
})
export class AdminModule {}
