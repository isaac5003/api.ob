import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { SellingType } from '../entities/SellingType.entity';
import { AccountingCatalog } from 'src/entries/entities/AccountingCatalog.entity';
import { validationMessage } from 'src/_tools';

export class serviceDataDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  name: string;

  @IsNotEmpty({ message: validationMessage('cost', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('cost', 'IsInt') })
  cost: number;

  @IsNotEmpty({ message: validationMessage('sellingType', 'IsNotEmpty') })
  @IsString({ message: validationMessage('sellingType', 'IsString') })
  sellingType: SellingType;

  @IsNotEmpty({ message: validationMessage('description', 'IsNotEmpty') })
  @IsString({ message: validationMessage('description', 'IsString') })
  description: string;

  @IsNotEmpty({ message: validationMessage('incIva', 'IsNotEmpty') })
  @Transform(({ value }) =>
    value.toLowerCase() === 'true'
      ? true
      : value.toLowerCase() == 'false'
      ? false
      : null,
  )
  @IsBoolean({ message: validationMessage('incIva', 'IsBoolean') })
  incIva: boolean;

  @IsNotEmpty({ message: validationMessage('incRenta', 'IsNotEmpty') })
  @Transform(({ value }) =>
    value.toLowerCase() === 'true'
      ? true
      : value.toLowerCase() == 'false'
      ? false
      : null,
  )
  @IsBoolean({
    message: validationMessage('incRenta', 'IsBoolean'),
  })
  incRenta: boolean;

  @IsOptional()
  @Transform(({ value }) =>
    value.toLowerCase() === 'true'
      ? true
      : value.toLowerCase() == 'false'
      ? false
      : null,
  )
  @IsBoolean({ message: validationMessage('active', 'IsBoolean') })
  active: boolean;

  @IsOptional()
  @IsString({ message: validationMessage('accountingCatalog', 'IsString') })
  accountingCatalog: AccountingCatalog;
}
