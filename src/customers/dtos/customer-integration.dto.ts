import { IsOptional, IsUUID } from 'class-validator';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';
import { validationMessage } from '../../_tools';

export class AccountignCatalogIntegrationDTO {
  @IsOptional()
  @IsUUID('all', { message: validationMessage('accountingCatalogCXC', 'IsUUID') })
  accountingCatalogCXC: AccountingCatalog;

  @IsOptional()
  @IsUUID('all', { message: validationMessage('accountingCatalogSales', 'IsUUID') })
  accountingCatalogSales: AccountingCatalog;
}
