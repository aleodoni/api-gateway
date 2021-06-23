import { IsBooleanString, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  readonly name: string;

  @IsBooleanString()
  readonly enabled: boolean;

  @IsNumberString()
  readonly roleId: number;
}
