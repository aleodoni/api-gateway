import { IsBooleanString, IsNotEmpty } from 'class-validator';

export class UpdatePermissionDto {
  @IsNotEmpty()
  readonly name: string;

  @IsBooleanString()
  readonly enabled: boolean;
}
