import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { AccountignCatalogIntegrationDTO } from '../../../customers/dtos/customer-integration.dto';
import { validationMessage } from '../../../_tools';
import { AccountingCatalog } from '../../entities/AccountingCatalog.entity';

export class SettingIntegrationsDTO extends AccountignCatalogIntegrationDTO {
  @IsNotEmpty({ message: validationMessage('accountingDebitCatalog', 'IsNotEmpty') })
  @IsUUID('4', { message: validationMessage('accountingDebitCatalog', 'IsUUID') })
  accountingDebitCatalog: AccountingCatalog;

  @IsNotEmpty({ message: validationMessage('accountingCreditCatalog', 'IsNotEmpty') })
  @IsUUID('4', { message: validationMessage('accountingCreditCatalog', 'IsUUID') })
  accountingCreditCatalog: AccountingCatalog;

  @IsNotEmpty({ message: validationMessage('registerType', 'IsNotEmpty') })
  @IsEnum({ automatic: 'automatic', manual: 'manual' }, { message: validationMessage('registerType', 'IsEnum') })
  registerType: string;
}
