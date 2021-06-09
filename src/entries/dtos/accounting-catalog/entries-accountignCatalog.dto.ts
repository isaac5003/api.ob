import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class AccountingCatalogDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty({ message: validationMessage('isAcreedora', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('isAcreedora', 'IsBoolean') })
  isAcreedora: boolean;

  @IsNotEmpty({ message: validationMessage('isBalance', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('isBalance', 'IsBoolean') })
  isBalance: boolean;
}
