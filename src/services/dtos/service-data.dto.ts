import {
  IsBooleanString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { SellingType } from '../entities/SellingType.entity';
import { AccountingCatalog } from 'src/entries/entities/AccountingCatalog.entity';

export class serviceDataDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsInt()
  cost: number;

  @IsNotEmpty()
  @IsString()
  sellingType: SellingType;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsBooleanString()
  incIva: boolean;

  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsBooleanString()
  incRenta: boolean;

  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsBooleanString()
  active: boolean;

  @IsOptional()
  @IsString()
  accountingCatalog: AccountingCatalog;
}
