import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsBooleanString,
  IsString,
  IsNotEmpty,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { BranchAddDTO } from './branch-add-dto';

export class CustomerAddDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsInt()
  customerType: number;

  @IsOptional()
  @IsInt()
  customerTaxerType: number;

  @IsOptional()
  @IsInt()
  customerTypeNatural: number;

  @ValidateNested()
  @Type(() => BranchAddDTO)
  branch: BranchAddDTO;
}
