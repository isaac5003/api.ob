import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Company } from '../../companies/entities/Company.entity';
import { validationMessage } from '../../_tools';

export class InvoiceDocumentDBDTO {
  @IsOptional()
  authorization: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('initial', 'IsInt') })
  initial: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('final', 'IsInt') })
  final: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('current', 'IsInt') })
  current: number;

  @IsOptional()
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : 1))
  @IsBoolean({ message: validationMessage('active', 'IsBoolean') })
  active: boolean;

  @IsOptional()
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : 2))
  @IsBoolean({ message: validationMessage('used', 'IsBoolean') })
  used: boolean;

  @IsOptional()
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : 2))
  @IsBoolean({ message: validationMessage('isCurrentDocument', 'IsBoolean') })
  isCurrentDocument: boolean;

  @IsOptional()
  documentLayout: any;

  @IsOptional()
  company: Company;

  @IsOptional()
  documentType: DocumentType;
}
