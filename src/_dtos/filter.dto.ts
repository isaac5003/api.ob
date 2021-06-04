import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { validationMessage } from '../_tools';

export class FilterDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  limit: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  page: number;

  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  search: string;

  @IsOptional()
  prop: string;

  @IsOptional()
  order: string;

  @IsOptional()
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : null))
  @IsBoolean({ message: validationMessage('active', 'IsBoolean') })
  active: boolean;
}
