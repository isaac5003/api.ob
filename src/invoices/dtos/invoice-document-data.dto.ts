import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Company } from 'src/companies/entities/Company.entity';
import { validationMessage } from 'src/_tools';

export class InvoiceDocumentDataDTO {
  @IsOptional()
  @IsString({ message: validationMessage('authorization', 'IsString') })
  authorization: string;

  @IsOptional()
  @IsInt({ message: validationMessage('initial', 'IsInt') })
  initial: number;

  @IsOptional()
  @IsInt({ message: validationMessage('final', 'IsInt') })
  final: number;

  @IsOptional()
  @IsInt({ message: validationMessage('current', 'IsInt') })
  current: number;

  @IsOptional()
  @Transform(({ value }) =>
    value.toLowerCase() === 'true'
      ? true
      : value.toLowerCase() == 'false'
      ? false
      : null,
  )
  @IsBoolean({ message: validationMessage('active', 'IsBoolean') })
  active: boolean;

  @IsOptional()
  @Transform(({ value }) =>
    value.toLowerCase() === 'true'
      ? true
      : value.toLowerCase() == 'false'
      ? false
      : null,
  )
  @IsBoolean({ message: validationMessage('used', 'IsBoolean') })
  used: boolean;

  @IsOptional()
  @Transform(({ value }) =>
    value.toLowerCase() === 'true'
      ? true
      : value.toLowerCase() == 'false'
      ? false
      : null,
  )
  @IsBoolean({ message: validationMessage('isCurrentDocument', 'IsBoolean') })
  isCurrentDocument: boolean;

  @IsOptional()
  @IsString({ message: validationMessage('documentLayout', 'IsString') })
  documentLayout: string;

  @IsOptional()
  @IsString({ message: validationMessage('layout', 'IsString') })
  layout: string;

  @IsNotEmpty({ message: validationMessage('company', 'IsNotEmpty') })
  company: Company;

  @IsOptional()
  documentType: DocumentType;
}
