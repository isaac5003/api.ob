import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { DocumentBasicsLayoutDTO } from './invoice-document-basics-layout.dto';

export class DocumentLayoutHeaderDTO extends DocumentBasicsLayoutDTO {
  @IsNotEmpty({ message: validationMessage('length', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('length', 'IsInt') })
  length: number;
}
