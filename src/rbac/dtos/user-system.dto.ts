import { IsNumberString } from 'class-validator';

export class UserSystemDto {
  @IsNumberString()
  readonly userId: number;

  @IsNumberString()
  readonly systemId: number;
}
