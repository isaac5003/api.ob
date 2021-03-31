import { IsNotEmpty, IsString } from 'class-validator';
import { AccountingCatalog } from 'src/entries/entities/AccountingCatalog.entity';

export class ServiceIntegrationDTO {
  @IsNotEmpty()
  @IsString()
  accountingCatalog: AccountingCatalog;
}
