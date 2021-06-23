import { IsBooleanString, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  readonly name: string;

  @IsBooleanString()
  readonly enabled: boolean;
}
