import { Transform } from 'class-transformer';
import { IsISO8601, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Branch } from 'src/companies/entities/Branch.entity';
import { Company } from 'src/companies/entities/Company.entity';
import { validationMessage } from 'src/_tools';
import { PurchasesStatus } from '../../entities/PurchasesStatus.entity';
import { PurchaseBaseDTO } from '../purchase-base.dto';

export class PurchaseHeaderDTO extends PurchaseBaseDTO {
  @IsNotEmpty({ message: validationMessage('authorization', 'IsNotEmpty') })
  authorization: string;

  @IsNotEmpty({ message: validationMessage('sequence', 'IsNotEmpty') })
  sequence: string;

  @IsNotEmpty({ message: validationMessage('providerName', 'IsNotEmpty') })
  providerName: string;

  @IsOptional()
  providerAddress1: string;

  @IsOptional()
  providerAddress2: string;

  @IsOptional()
  providerCountry: string;

  @IsOptional()
  providerState: string;

  @IsOptional()
  providerCity: string;

  @IsOptional()
  providerDui: string;

  @IsOptional()
  providerNit: string;

  @IsOptional()
  providerNrc: string;

  @IsOptional()
  providerGiro: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('sum', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('sum', 'IsNotEmpty') })
  sum: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('iva', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('iva', 'IsNotEmpty') })
  iva: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('fovial', 'IsNumber') })
  @IsOptional()
  fovial: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('contrans', 'IsNumber') })
  @IsOptional()
  contrans: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('subTotal', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('subTotal', 'IsNotEmpty') })
  subTotal: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ivaRetenido', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ivaRetenido', 'IsNotEmpty') })
  ivaRetenido: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('comprasExentas', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('comprasExentas', 'IsNotEmpty') })
  comprasExentas: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('comprasNoSujetas', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('comprasNoSujetas', 'IsNotEmpty') })
  comprasNoSujetas: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('compraTotal', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('compraTotal', 'IsNotEmpty') })
  compraTotal: number;

  @IsOptional()
  compraTotalText: string;

  @IsNotEmpty({ message: validationMessage('purchaseDate', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('purchaseDate', 'IsISO8601') })
  purchaseDate: string;

  @IsOptional()
  paymentConditionName: string;

  @IsNotEmpty({ message: validationMessage('branch', 'IsNotEmpty') })
  branch: Branch;

  @IsNotEmpty({ message: validationMessage('company', 'IsNotEmpty') })
  company: Company;

  @IsNotEmpty({ message: validationMessage('providerBranch', 'IsNotEmpty') })
  providerBranch: string;

  @IsNotEmpty({ message: validationMessage('provider', 'IsNotEmpty') })
  provider: string;

  @IsNotEmpty({
    message: validationMessage('purchasePaymentsCondition', 'IsNotEmpty'),
  })
  purchasePaymentsCondition: string;

  @IsNotEmpty({ message: validationMessage('status', 'IsNotEmpty') })
  status: number;

  @IsNotEmpty({ message: validationMessage('providerType', 'IsNotEmpty') })
  providerType: number;

  @IsNotEmpty({
    message: validationMessage('providerTypeNatural', 'IsNotEmpty'),
  })
  providerTypeNatural: number;

  @IsNotEmpty({ message: validationMessage('documentType', 'IsNotEmpty') })
  documentType: number;
}
