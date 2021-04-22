import { IsOptional } from 'class-validator';
import { AccountingCatalogDTO } from './entries-accountignCatalog.dto';

export class AccountingUpdateDTO extends AccountingCatalogDTO {
  @IsOptional()
  code: string;
}
