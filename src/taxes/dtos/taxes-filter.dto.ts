import { IsISO8601, IsOptional } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { FilterDTO } from '../../_dtos/filter.dto';

export class TaxesFilterDTO extends FilterDTO {
  @IsOptional()
  documentType: string;

  @IsOptional()
  registerType: string;

  @IsOptional()
  customer: string;

  @IsOptional()
  @IsISO8601({}, { message: validationMessage('startDate', 'IsISO8601') })
  startDate: string;

  @IsOptional()
  @IsISO8601({}, { message: validationMessage('endDate', 'IsISO8601') })
  endDate: string;
}
