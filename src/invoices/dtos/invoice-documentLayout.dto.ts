import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { type } from 'node:os';
import { validationMessage } from 'src/_tools';
import { DocumentBasicsLayoutDTO } from './invoice-document-basics-layout.dto';
import { DocumentLayoutHeaderDTO } from './invoice-document-layout-header.dto';
import { DocumentDetailLayoutDTO } from './invoice-documentlayout-details.dto';

export class DocumentLayoutDTO {
  @IsNotEmpty({ message: validationMessage('configuration', 'IsNotEmpty') })
  configuration: string;

  @IsNotEmpty({ message: validationMessage('resolution', 'IsNotEmpty') })
  @IsNumber({}, { each: true })
  @Transform(({ value }) => parseInt(value))
  resolution: number[];

  @IsNotEmpty({ message: validationMessage('header', 'IsNotEmpty') })
  @IsArray()
  @ValidateNested()
  @Type(() => DocumentLayoutHeaderDTO)
  header: DocumentLayoutHeaderDTO[];

  @IsNotEmpty({ message: validationMessage('details', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => DocumentDetailLayoutDTO)
  details: DocumentDetailLayoutDTO;

  @IsNotEmpty({ message: validationMessage('resolution', 'IsNotEmpty') })
  @IsArray()
  @ValidateNested()
  @Type(() => DocumentBasicsLayoutDTO)
  totals: DocumentBasicsLayoutDTO[];
}
