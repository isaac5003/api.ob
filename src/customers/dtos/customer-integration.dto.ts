import { IsNotEmpty, IsString } from 'class-validator';
import { AccountingCatalog } from 'src/entries/entities/AccountingCatalog.entity';
import { validationMessage } from 'src/_tools';

export class CustomerIntegrationDTO {
  @IsNotEmpty({ message: validationMessage('accountingCatalog', 'IsNotEmpty') })
  @IsString({ message: validationMessage('accountingCatalog', 'IsString') })
  accountingCatalog: AccountingCatalog;
}
