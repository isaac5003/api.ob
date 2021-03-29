import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsBooleanString,
  IsString,
  IsDefined,
} from 'class-validator';

export class CustomerAddDTO {
  @IsString()
  name: string;

  @IsString()
  shortName: string;

  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsBooleanString()
  isProvider: boolean;

  @IsOptional()
  @IsString()
  dui: string;

  @IsOptional()
  @IsString()
  nit: string;

  @IsOptional()
  @IsString()
  nrc: string;

  @IsOptional()
  @IsString()
  giro: string;

  @IsString()
  customerType: string;

  @IsOptional()
  @IsString()
  customerTaxerType: string;

  @IsOptional()
  @IsString()
  customerTypeNatural: string;

  @IsDefined()
  branch: string;
}
