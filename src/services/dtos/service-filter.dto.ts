import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsBooleanString } from 'class-validator';
import { FilterDTO } from 'src/_dtos/filter.dto';

export class ServiceFilterDTO extends FilterDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  type: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  fromAmount: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  toAmount: number;

  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsBooleanString()
  active: boolean;
}
