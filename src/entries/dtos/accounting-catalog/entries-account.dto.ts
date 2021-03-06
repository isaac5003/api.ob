import { IsOptional, IsUUID } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class AccountsDTO {
  @IsOptional()
  @IsUUID('4', { message: validationMessage('parentCatalog', 'IsUUID') })
  parentCatalog: string;
}
