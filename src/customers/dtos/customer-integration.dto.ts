import { IsNotEmpty } from 'class-validator';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';
import { validationMessage } from '../../_tools';

export class AccountignCatalogIntegrationDTO {
  @IsNotEmpty({ message: validationMessage('accountingCatalog', 'IsNotEmpty') })
  @IsUUID('all', { message: validationMessage('accountingCatalog', 'IsUUID') })
  accountingCatalog: AccountingCatalog;
}
