import { IsOptional, IsUUID } from 'class-validator';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';
import { validationMessage } from '../../_tools';

export class ServiceIntegrationDTO {
  @IsOptional()
  @IsUUID('all', { message: validationMessage('accountingCatalog', 'IsUUID') })
  accountingCatalog: AccountingCatalog;
}
