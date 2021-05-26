import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsBoolean } from 'class-validator';
import { FilterDTO } from '../../_dtos/filter.dto';
import { validationMessage } from '../../_tools';

export class ServiceFilterDTO extends FilterDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('type', 'IsInt') })
  type: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  fromAmount: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  toAmount: number;
}
