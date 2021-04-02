import { IsNotEmpty, IsString } from 'class-validator';
import { AccountingCatalog } from 'src/entries/entities/AccountingCatalog.entity';
import { validationMessage } from 'src/_tools';

export class ServiceIntegrationDTO {
  @IsNotEmpty({ message: validationMessage('accountingCatalog', 'IsNotEmpty') })
  @IsString()
  accountingCatalog: AccountingCatalog;
}
