import { IsBooleanString } from 'class-validator';

export class UpdateUserRoleDto {
  @IsBooleanString()
  readonly enabled: boolean;
}
