import {
  IsBooleanString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { SellingType } from '../entities/SellingType.entity';

export class serviceCreateDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @IsNotEmpty()
  @IsString()
  sellingType: SellingType;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBooleanString()
  incIva: boolean;

  @IsNotEmpty()
  @IsBooleanString()
  incRenta: boolean;
}
