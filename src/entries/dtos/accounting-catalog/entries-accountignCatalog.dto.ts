import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class AccountingCatalogDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty({ message: validationMessage('isAcreedora', 'IsNotEmpty') })
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : 1))
  @IsBoolean({ message: validationMessage('isAcreedora', 'IsBoolean') })
  isAcreedora: boolean;

  @IsNotEmpty({ message: validationMessage('isBalance', 'IsNotEmpty') })
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : 1))
  @IsBoolean({ message: validationMessage('isBalance', 'IsBoolean') })
  isBalance: boolean;
}
