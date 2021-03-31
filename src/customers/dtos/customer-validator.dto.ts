import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsBooleanString,
  IsString,
  IsNotEmpty,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { BranchAddDTO } from './branch-add.dto';

export class CustomerValidateDTO {
  @IsNotEmpty({ message: 'name es campo requerido' })
  @IsString({ message: 'name debe ser de tipo string' })
  name: string;

  @IsNotEmpty({ message: 'shortName es campo requerido' })
  @IsString({ message: 'shortName debe ser de tipo string' })
  shortName: string;

  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsBooleanString({ message: 'isProvider debe ser de tipo boolean' })
  isProvider: boolean;

  @IsOptional()
  @IsString({ message: 'dui debe ser de tipo string' })
  dui: string;

  @IsOptional()
  @IsString({ message: 'nit debe ser de tipo string' })
  nit: string;

  @IsOptional()
  @IsString({ message: 'nrc debe ser de tipo string' })
  nrc: string;

  @IsOptional()
  @IsString({ message: 'giro debe ser de tipo string' })
  giro: string;

  @IsNotEmpty({ message: 'customerType es campo requerido' })
  @IsInt({ message: 'customerType debe ser de tipo integer' })
  customerType: number;

  @IsOptional()
  @IsInt({ message: 'customerTaxerType debe ser de tipo integer' })
  customerTaxerType: number;

  @IsOptional({ message: 'customerTypeNatural debe ser de tipo integer' })
  @IsInt()
  customerTypeNatural: number;

  @IsNotEmpty({ message: 'branch es campo requerido' })
  @ValidateNested()
  @Type(() => BranchAddDTO)
  branch: BranchAddDTO;
}
