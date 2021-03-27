import { Transform } from 'class-transformer';
import { IsOptional, IsBooleanString } from 'class-validator';
import { FilterDTO } from 'src/_dtos/filter.dto';

export class CustomerFilterDTO extends FilterDTO {
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsBooleanString()
  active: boolean;
}
