import { IsBooleanString, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateUserRoleDto {
  @IsBooleanString()
  readonly enabled: boolean;

  @IsNumberString()
  readonly userId: number;

  @IsNumberString()
  readonly roleId: number;
}
