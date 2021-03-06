import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Branch } from '../../companies/entities/Branch.entity';
import { Company } from '../../companies/entities/Company.entity';
import { Customer } from '../../customers/entities/Customer.entity';
import { CustomerBranch } from '../../customers/entities/CustomerBranch.entity';
import { PersonType } from '../../customers/entities/customers.personType.entity';
import { CustomerTypeNatural } from '../../customers/entities/CustomerTypeNatural.entity';
import { validationMessage } from '../../_tools';
import { InvoicesDocumentTypes } from '../entities/invoices.documentTypes.entity';
import { InvoicesPaymentsConditions } from '../entities/invoices.paymentsConditions.entity';
import { InvoicesSellers } from '../entities/invoices.sellers.entity';
import { InvoicesZones } from '../entities/invoices.zones.entity';
import { InvoicesStatuses } from '../entities/invoices.statuses.entity';

export class InvoiceHeaderDataDTO {
  @IsNotEmpty({ message: validationMessage('authorization', 'IsNotEmpty') })
  @IsString({ message: validationMessage('authorization', 'IsString') })
  authorization: string;

  @IsNotEmpty({ message: validationMessage('sequence', 'IsNotEmpty') })
  @IsString({ message: validationMessage('sequence', 'IsString') })
  sequence: string;

  @IsNotEmpty({ message: validationMessage('customerName', 'IsNotEmpty') })
  @IsString({ message: validationMessage('customerName', 'IsString') })
  customerName: string;

  @IsOptional()
  @IsString({ message: validationMessage('customerAddress1', 'IsString') })
  customerAddress1: string;

  @IsOptional()
  @IsString({ message: validationMessage('customerAddress2', 'IsString') })
  customerAddress2: string;

  @IsOptional()
  @IsString({ message: validationMessage('customerCountry', 'IsString') })
  customerCountry: string;

  @IsOptional()
  @IsString({ message: validationMessage('customerState', 'IsString') })
  customerState: string;

  @IsOptional()
  @IsString({ message: validationMessage('customerCity', 'IsString') })
  customerCity: string;

  @IsOptional()
  @IsString({ message: validationMessage('customerDui', 'IsString') })
  customerDui: string;

  @IsOptional()
  @IsString({ message: validationMessage('customerNit', 'IsString') })
  customerNit: string;

  @IsOptional()
  @IsString({ message: validationMessage('customerNrc', 'IsString') })
  customerNrc: string;

  @IsOptional()
  @IsString({ message: validationMessage('customerGiro', 'IsString') })
  customerGiro: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('sum', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('sum', 'IsNotEmpty') })
  sum: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('iva', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('iva', 'IsNotEmpty') })
  iva: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('subTotal', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('subTotal', 'IsNotEmpty') })
  subTotal: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ivaRetenido', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ivaRetenido', 'IsNotEmpty') })
  ivaRetenido: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ventasExentas', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ventasExentas', 'IsNotEmpty') })
  ventasExentas: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ventasNoSujetas', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ventasNoSujetas', 'IsNotEmpty') })
  ventasNoSujetas: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ventaTotal', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ventaTotal', 'IsNotEmpty') })
  ventaTotal: number;

  @IsOptional()
  @IsString({ message: validationMessage('customerGiro', 'IsString') })
  ventaTotalText: string;

  @IsNotEmpty({ message: validationMessage('invoiceDate', 'IsNotEmpty') })
  @IsDate({ message: validationMessage('invoiceDate', 'IsDate') })
  invoiceDate: string;

  @IsOptional()
  @IsString({ message: validationMessage('paymentConditionName', 'IsString') })
  paymentConditionName: string;

  @IsOptional()
  @IsString({ message: validationMessage('sellerName', 'IsString') })
  sellerName: string;

  @IsOptional()
  @IsString({ message: validationMessage('zoneName', 'IsString') })
  zoneName: string;

  @IsNotEmpty({ message: validationMessage('branch', 'IsNotEmpty') })
  branch: Branch;

  @IsNotEmpty({ message: validationMessage('company', 'IsNotEmpty') })
  company: Company;

  @IsNotEmpty({ message: validationMessage('customerBranch', 'IsNotEmpty') })
  customerBranch: CustomerBranch;

  @IsNotEmpty({ message: validationMessage('customer', 'IsNotEmpty') })
  customer: Customer;

  @IsNotEmpty({
    message: validationMessage('invoicesPaymentsCondition', 'IsNotEmpty'),
  })
  invoicesPaymentsCondition: InvoicesPaymentsConditions;

  @IsNotEmpty({ message: validationMessage('invoicesSeller', 'IsNotEmpty') })
  invoicesSeller: InvoicesSellers;

  @IsNotEmpty({ message: validationMessage('invoicesZone', 'IsNotEmpty') })
  invoicesZone: InvoicesZones;

  @IsNotEmpty({ message: validationMessage('status', 'IsNotEmpty') })
  status: InvoicesStatuses;

  @IsNotEmpty({ message: validationMessage('personType', 'IsNotEmpty') })
  personType: PersonType;

  @IsNotEmpty({
    message: validationMessage('customerTypeNatural', 'IsNotEmpty'),
  })
  customerTypeNatural: CustomerTypeNatural;

  @IsNotEmpty({ message: validationMessage('documentType', 'IsNotEmpty') })
  documentType: InvoicesDocumentTypes;
}
