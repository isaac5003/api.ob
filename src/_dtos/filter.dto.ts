import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

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
}
