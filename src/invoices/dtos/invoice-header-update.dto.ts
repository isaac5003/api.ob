import { Transform } from 'class-transformer';
import { IsString, IsInt, IsOptional } from 'class-validator';
import { validationMessage } from '../../_tools';
import { InvoiceHeaderDTO } from './invoice-header.dto';

export class InvoiceUpdateHeaderDTO extends InvoiceHeaderDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  documentType: number;

  @IsOptional()
  @IsString({ message: validationMessage('authorization', 'IsString') })
  authorization: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('sequence', 'IsInt') })
  sequence: number;
}
