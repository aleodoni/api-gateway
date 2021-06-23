import { IsBooleanString, IsNotEmpty } from 'class-validator';

export class UpdateSystemDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly desc: string;

  @IsBooleanString()
  readonly enabled: boolean;
}
