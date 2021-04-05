import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsDate, IsNumber } from 'class-validator';
import { Customer } from 'src/customers/entities/Customer.entity';
import { CustomerBranch } from 'src/customers/entities/CustomerBranch.entity';
import { validationMessage } from 'src/_tools';
import { InvoicesDocumentType } from '../entities/InvoicesDocumentType.entity';
import { InvoicesPaymentsCondition } from '../entities/InvoicesPaymentsCondition.entity';
import { InvoicesSeller } from '../entities/InvoicesSeller.entity';

export class InvoiceHeaderDTO {
  @IsNotEmpty({ message: validationMessage('customer', 'IsNotEmpty') })
  customer: string;

  @IsNotEmpty({ message: validationMessage('customerBranch', 'IsNotEmpty') })
  customerBranch: string;

  @IsNotEmpty({ message: validationMessage('invoicesSeller', 'IsNotEmpty') })
  invoicesSeller: string;

  @IsNotEmpty({
    message: validationMessage('InvoicesPaymentsCondition', 'IsNotEmpty'),
  })
  invoicesPaymentsCondition: InvoicesPaymentsCondition;

  @IsNotEmpty({ message: validationMessage('documentType', 'IsNotEmpty') })
  @IsString({ message: validationMessage('documentType', 'IsString') })
  documentType: InvoicesDocumentType;

  @IsNotEmpty({ message: validationMessage('authorization', 'IsNotEmpty') })
  @IsString({ message: validationMessage('authorization', 'IsString') })
  authorization: string;

  @IsNotEmpty({ message: validationMessage('sequence', 'IsNotEmpty') })
  @IsString({ message: validationMessage('sequence', 'IsString') })
  sequence: string;

  @IsNotEmpty({ message: validationMessage('invoiceDate', 'IsNotEmpty') })
  @IsDate({ message: validationMessage('invoiceDate', 'IsDate') })
  invoiceDate: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: validationMessage('sum', 'IsNumber') },
  )
  @IsNotEmpty({ message: validationMessage('sum', 'IsNotEmpty') })
  sum: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: validationMessage('iva', 'IsNumber') },
  )
  @IsNotEmpty({ message: validationMessage('iva', 'IsNotEmpty') })
  iva: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: validationMessage('subTotal', 'IsNumber') },
  )
  @IsNotEmpty({ message: validationMessage('subTotal', 'IsNotEmpty') })
  subTotal: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: validationMessage('ivaRetenido', 'IsNumber') },
  )
  @IsNotEmpty({ message: validationMessage('ivaRetenido', 'IsNotEmpty') })
  ivaRetenido: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: validationMessage('ventasExentas', 'IsNumber') },
  )
  @IsNotEmpty({ message: validationMessage('ventasExentas', 'IsNotEmpty') })
  ventasExentas: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: validationMessage('ventasNoSujetas', 'IsNumber') },
  )
  @IsNotEmpty({ message: validationMessage('ventasNoSujetas', 'IsNotEmpty') })
  ventasNoSujetas: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: validationMessage('ventaTotal', 'IsNumber') },
  )
  @IsNotEmpty({ message: validationMessage('ventaTotal', 'IsNotEmpty') })
  ventaTotal: number;
}
