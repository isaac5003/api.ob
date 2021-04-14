import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { DocumentDetailsOptionDTO } from './invoice-documentlayout-detailsoption.dto';

export class DocumentLayoutDescriptionOptionDTO extends DocumentDetailsOptionDTO {
  @IsNotEmpty({ message: validationMessage('length', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('length', 'IsInt') })
  length: number;
}
