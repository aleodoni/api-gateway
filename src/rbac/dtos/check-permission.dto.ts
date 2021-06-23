import { IsArray, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CheckPermissionDto {
  @IsNumberString()
  readonly userId: number;

  @IsString()
  readonly system: string;

  @IsArray()
  readonly roles: string[];

  @IsOptional()
  @IsString()
  readonly permission: string;
}
