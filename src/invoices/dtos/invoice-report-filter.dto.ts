import { Transform } from 'class-transformer';
import { IsInt, IsISO8601, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class ReportFilterDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  documentType: number;

  @IsOptional()
  @IsUUID('4', { message: validationMessage('customer', 'IsUUID') })
  customer: string;

  @IsOptional()
  @IsUUID('4', { message: validationMessage('seller', 'IsUUID') })
  seller: string;

  @IsOptional()
  @IsUUID('4', { message: validationMessage('zone', 'IsUUID') })
  zone: string;

  @IsOptional()
  @IsUUID('4', { message: validationMessage('service', 'IsUUID') })
  service: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('status', 'IsInt') })
  status: number;

  @IsNotEmpty({ message: validationMessage('startDate', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('startDate', 'IsISO8601') })
  startDate: string;

  @IsNotEmpty({ message: validationMessage('endDate', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('endDate', 'IsISO8601') })
  endDate: string;
}
