import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsInt, ValidateNested, IsBoolean } from 'class-validator';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';
import { validationMessage } from '../../_tools';
import { CustomerTaxerType } from '../entities/CustomerTaxerType.entity';
import { CustomerType } from '../entities/CustomerType.entity';
import { CustomerTypeNatural } from '../entities/CustomerTypeNatural.entity';
import { BranchDataDTO } from './customer-branch.dto';

export class CustomerDataDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  @IsString({ message: validationMessage('name', 'IsString') })
  name: string;

  @IsNotEmpty({ message: validationMessage('shortName', 'IsNotEmpty') })
  @IsString({ message: validationMessage('shortName', 'IsString') })
  shortName: string;

  @IsOptional()
  @IsString({ message: validationMessage('dui', 'IsString') })
  dui: string;

  @IsOptional()
  @IsString({ message: validationMessage('nit', 'IsString') })
  nit: string;

  @IsOptional()
  @IsString({ message: validationMessage('nrc', 'IsString') })
  nrc: string;

  @IsOptional()
  @IsString({ message: validationMessage('giro', 'IsString') })
  giro: string;

  @IsNotEmpty({ message: validationMessage(' customerType', 'IsNotEmpty') })
  @IsInt({ message: validationMessage('customerType', 'IsInt') })
  customerType: CustomerType;

  @IsOptional()
  @IsInt({ message: validationMessage('customerTaxerType', 'IsInt') })
  customerTaxerType: CustomerTaxerType;

  @IsOptional({ message: 'customerTypeNatural debe ser de tipo integer' })
  @IsInt({ message: validationMessage('customerTypeNatural', 'IsInt') })
  customerTypeNatural: CustomerTypeNatural;

  @IsNotEmpty({ message: validationMessage('branch', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => BranchDataDTO)
  branch: BranchDataDTO;

  @IsOptional()
  @IsString({ message: validationMessage('accountingCatalog', 'IsString') })
  accountingCatalog: AccountingCatalog;
}
