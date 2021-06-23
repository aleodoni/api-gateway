import { IsBooleanString, IsNotEmpty } from 'class-validator';

export class CreateSystemDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly desc: string;

  @IsBooleanString()
  readonly enabled: boolean;
}
