import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { validationMessage } from '../../_tools';
import { InvoiceDetailDTO } from './invoice-details.dto';
import { InvoiceHeaderCreateDTO } from './invoice-header-create.dto';
import { InvoiceUpdateHeaderDTO } from './invoice-header-update.dto';
import { InvoiceHeaderDTO } from './invoice-header.dto';

export class InvoiceDataDTO {
  @IsNotEmpty({ message: validationMessage('header', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => InvoiceHeaderDTO)
  header: InvoiceHeaderCreateDTO | InvoiceUpdateHeaderDTO;

  @IsNotEmpty({ message: validationMessage('details', 'IsNotEmpty') })
  @ValidateNested({ each: true })
  @Type(() => InvoiceDetailDTO)
  details: InvoiceDetailDTO[];
}
