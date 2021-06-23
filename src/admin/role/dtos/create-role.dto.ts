import { IsBooleanString, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  readonly name: string;

  @IsBooleanString()
  readonly enabled: boolean;

  @IsNumberString()
  readonly systemId: number;
}
