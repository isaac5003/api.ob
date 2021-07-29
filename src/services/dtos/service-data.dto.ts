import { IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { SellingType } from '../../system/entities/SellingType.entity';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';
import { validationMessage } from '../../_tools';

export class serviceDataDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  name: string;

  @IsNotEmpty({ message: validationMessage('cost', 'IsNotEmpty') })
  @Transform(({ value }) => parseFloat(value).toFixed(2))
  @IsDecimal({ decimal_digits: '2' }, { message: validationMessage('cost', 'IsDecimal') })
  cost: number;

  @IsNotEmpty({ message: validationMessage('sellingType', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('sellingType', 'IsNumber') })
  sellingType: SellingType;

  @IsNotEmpty({ message: validationMessage('description', 'IsNotEmpty') })
  @IsString({ message: validationMessage('description', 'IsString') })
  description: string;

  @IsNotEmpty({ message: validationMessage('incIva', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('incIva', 'IsBoolean') })
  incIva: boolean;

  @IsNotEmpty({ message: validationMessage('incRenta', 'IsNotEmpty') })
  @IsBoolean({
    message: validationMessage('incRenta', 'IsBoolean'),
  })
  incRenta: boolean;

  @IsOptional()
  @IsBoolean({ message: validationMessage('active', 'IsBoolean') })
  active: boolean;

  @IsOptional()
  @IsString({ message: validationMessage('accountingCatalog', 'IsString') })
  accountingCatalog: AccountingCatalog;
}
