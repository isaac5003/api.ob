import { Transform } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional } from 'class-validator';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { validationMessage } from 'src/_tools';

export class EchargesFilterDTO extends FilterDTO {
  @IsOptional()
  @IsISO8601({}, { message: validationMessage('startDate', 'IsISO8601') })
  startDate: string;

  @IsOptional()
  @IsISO8601({}, { message: validationMessage('endDate', 'IsISO8601') })
  endDate: string;

  @IsOptional()
  customer: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  documentType: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('status', 'IsInt') })
  status: number;
}
