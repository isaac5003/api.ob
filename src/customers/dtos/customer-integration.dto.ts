import { IsNotEmpty } from 'class-validator';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';
import { validationMessage } from '../../_tools';

export class AccountignCatalogIntegrationDTO {
  @IsNotEmpty({ message: validationMessage('accountingCatalog', 'IsNotEmpty') })
  accountingCatalog: AccountingCatalog;
}
