import { IsNotEmpty } from 'class-validator';
import { AccountingCatalog } from 'src/entries/entities/AccountingCatalog.entity';
import { validationMessage } from 'src/_tools';

export class AccountignCatalogIntegrationDTO {
  @IsNotEmpty({ message: validationMessage('accountingCatalog', 'IsNotEmpty') })
  accountingCatalog: AccountingCatalog;
}
