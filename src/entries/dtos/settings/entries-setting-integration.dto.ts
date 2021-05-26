import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import { AccountignCatalogIntegrationDTO } from '../../../customers/dtos/customer-integration.dto';
import { validationMessage } from '../../../_tools';
import { AccountingCatalog } from '../../entities/AccountingCatalog.entity';

export class SettingIntegrationsDTO extends AccountignCatalogIntegrationDTO {
  @IsNotEmpty({ message: validationMessage('accountingCatalog', 'IsNotEmpty') })
  @IsUUID('4', { message: validationMessage('accountingCatalog', 'IsUUID') })
  accountingCatalog: AccountingCatalog;

  @IsNotEmpty({ message: validationMessage('registerType', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('registerType', 'IsInt') })
  resgisterType: number;
}
