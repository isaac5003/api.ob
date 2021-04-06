import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { InvoiceDetailDTO } from './invoice-details.dto';
import { InvoiceHeaderDTO } from './invoice-header.dto';

export class InvoiceDataDTO {
  @IsNotEmpty({ message: validationMessage('header', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => InvoiceHeaderDTO)
  header: InvoiceHeaderDTO;

  @IsNotEmpty({ message: validationMessage('details', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => InvoiceDetailDTO)
  details: InvoiceDetailDTO[];
}
