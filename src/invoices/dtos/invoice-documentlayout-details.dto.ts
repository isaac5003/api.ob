import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { DocumentLayoutDescriptionOptionDTO } from './invocie-documentlayout-descriptiodetail.dto';
import { DocumentDetailsOptionDTO } from './invoice-documentlayout-detailsoption.dto';

export class DocumentDetailLayoutDTO {
  @IsNotEmpty({ message: validationMessage('position_y', 'IsNotEmpty') })
  position_y: string;

  @IsNotEmpty({ message: validationMessage('fontSize', 'IsNotEmpty') })
  fontSize: string;

  @IsNotEmpty({ message: validationMessage('heigth', 'IsNotEmpty') })
  heigth: string;

  @IsNotEmpty({ message: validationMessage('quantity', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => DocumentDetailsOptionDTO)
  quantity: DocumentDetailsOptionDTO;

  @IsNotEmpty({ message: validationMessage('description', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => DocumentDetailsOptionDTO)
  description: DocumentLayoutDescriptionOptionDTO;

  @IsNotEmpty({ message: validationMessage('price', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => DocumentDetailsOptionDTO)
  price: DocumentDetailsOptionDTO;

  @IsNotEmpty({ message: validationMessage('sujeto', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => DocumentDetailsOptionDTO)
  sujeto: DocumentDetailsOptionDTO;

  @IsNotEmpty({ message: validationMessage('exento', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => DocumentDetailsOptionDTO)
  exento: DocumentDetailsOptionDTO;

  @IsNotEmpty({ message: validationMessage('afecto', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => DocumentDetailsOptionDTO)
  afecto: DocumentDetailsOptionDTO;
}
