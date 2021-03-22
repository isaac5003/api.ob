import { Transform } from 'class-transformer';
import { IsBooleanString, IsInt, IsOptional } from 'class-validator';
import { FilterDto } from 'src/dtos/filter.dto';

export class ServiceFilterDto extends FilterDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  type: number;

  @IsOptional()
  @IsBooleanString()
  fromAmount: boolean;

  @IsOptional()
  @IsBooleanString()
  toAmount: boolean;
}
