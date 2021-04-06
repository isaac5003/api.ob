import { IsNotEmpty } from 'class-validator';
import { SellingType } from 'src/services/entities/SellingType.entity';
import { Service } from 'src/services/entities/Service.entity';
import { validationMessage } from 'src/_tools';
import { Invoice } from '../entities/Invoice.entity';
import { InvoiceDetailDTO } from './invoice-details.dto';

export class InvoiceDetailDataDTO extends InvoiceDetailDTO {
  @IsNotEmpty({ message: validationMessage('invoice', 'IsNotEmpty') })
  invoice: Invoice;
  @IsNotEmpty({ message: validationMessage('sellingType', 'IsNotEmpty') })
  sellingType: SellingType;
  @IsNotEmpty({ message: validationMessage('service', 'IsNotEmpty') })
  service: Service;
}
