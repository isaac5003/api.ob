import { IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';
import { AccountingCatalogDTO } from './entries-accountignCatalog.dto';

export class AccountingCreateDTO extends AccountingCatalogDTO {
  @IsNotEmpty({ message: validationMessage('code', 'IsNotEmpty') })
  code: string;
}
