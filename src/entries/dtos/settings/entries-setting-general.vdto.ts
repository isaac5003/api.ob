import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';
import { AccountingCatalog } from 'src/entries/entities/AccountingCatalog.entity';
import { validationMessage } from '../../../_tools';

export class SettingGeneralDTO {
  @IsNotEmpty({ message: validationMessage('periodStart', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('periodStart', 'IsISO8601') })
  periodStart: string;

  @IsNotEmpty({ message: validationMessage('peridoEnd', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('peridoEnd', 'IsISO8601') })
  peridoEnd: string;

  @IsNotEmpty({ message: validationMessage('accountingDebitCatalog', 'IsNotEmpty') })
  @IsUUID('4', { message: validationMessage('accountingDebitCatalog', 'IsUUID') })
  accountingDebitCatalog: AccountingCatalog;

  @IsNotEmpty({ message: validationMessage('accountingCreditCatalog', 'IsNotEmpty') })
  @IsUUID('4', { message: validationMessage('accountingCreditCatalog', 'IsUUID') })
  accountingCreditCatalog: AccountingCatalog;
}
