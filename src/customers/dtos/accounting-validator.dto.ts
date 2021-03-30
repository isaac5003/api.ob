import { IsNotEmpty, IsString } from 'class-validator';

export class CustomerAccountingValidateDTO {
  @IsNotEmpty()
  @IsString({ message: 'accountingCatalog debe ser de tipo string' })
  accountingCatalog: string;
}
