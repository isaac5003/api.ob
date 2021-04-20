import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class EntryDetailsDTO {
  @IsNotEmpty({ message: validationMessage('accountingCatalog', 'IsNotEmpty') })
  accountingCatalog: string;

  @IsNotEmpty({ message: validationMessage('concept', 'IsNotEmpty') })
  concept: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: validationMessage('cargo', 'IsNumber') },
  )
  cargo: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: validationMessage('abono', 'IsNumber') },
  )
  abono: number;

  @IsNotEmpty({ message: validationMessage('order', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: validationMessage('order', 'IsNumber') })
  order: number;
}
