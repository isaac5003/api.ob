import { IsNotEmpty, IsString } from 'class-validator';
import { AccountingCatalogRepository } from 'src/entries/repositories/AccountingCatalog.repository';

export class CustomerIntegrationDTO {
  @IsNotEmpty()
  @IsString({ message: 'accountingCatalog debe ser de tipo string' })
  accountingCatalog: AccountingCatalogRepository;
}
