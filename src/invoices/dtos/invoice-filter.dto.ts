import { Transform } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional, IsString } from 'class-validator';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { validationMessage } from 'src/_tools';

export class InvoiceFilterDTO extends FilterDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  documentType: number;

  @IsOptional()
  @IsString({ message: validationMessage('customer', 'IsString') })
  customer: string;

  @IsOptional()
  @IsString({ message: validationMessage('seller', 'IsString') })
  seller: string;

  @IsOptional()
  @IsString({ message: validationMessage('zone', 'IsString') })
  zone: string;

  @IsOptional()
  @IsString({ message: validationMessage('service', 'IsString') })
  service: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('status', 'IsInt') })
  status: number;

  @IsOptional()
  @IsISO8601({}, { message: validationMessage('startDate', 'IsISO8601') })
  startDate: string;

  @IsOptional()
  @IsISO8601({}, { message: validationMessage('endDate', 'IsISO8601') })
  endDate: string;
}
