import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import { AccountingCatalog } from '../../../entries/entities/AccountingCatalog.entity';
import { validationMessage } from '../../../_tools';
import { InvoiceIntegrationActiveDTO } from './invoice-integration-active.vdto';

export class InvoicesIntegrationsDTO extends InvoiceIntegrationActiveDTO {
  @IsNotEmpty({ message: validationMessage('cashPaymentAccountingCatalog', 'IsNotEmpty') })
  @IsUUID('4', { message: validationMessage('cashPaymentAccountingCatalog', 'IsUUID') })
  cashPaymentAccountingCatalog: AccountingCatalog;

  @IsNotEmpty({ message: validationMessage('automaticIntegration', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('automaticIntegration', 'IsBoolean') })
  automaticIntegration: boolean;

  @IsNotEmpty({ message: validationMessage('registerService', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('registerService', 'IsBoolean') })
  registerService: boolean;

  @IsNotEmpty({ message: validationMessage('recurencyFrecuency', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('recurencyFrecuency', 'IsInt') })
  recurrencyFrecuency: number;

  @IsNotEmpty({ message: validationMessage('recurrencyOption', 'IsNotEmpty') })
  recurrencyOption: string;
}
