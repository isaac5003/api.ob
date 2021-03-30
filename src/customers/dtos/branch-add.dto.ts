import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BranchAddDTO {
  @IsNotEmpty({ message: 'contacName es campo requerido' })
  @IsString({ message: 'contactName debe ser de tipo string' })
  contactName: string;

  @IsOptional()
  @IsString({ message: 'contactInfo debe ser de tipo string' })
  contactInfo: string;

  @IsNotEmpty({ message: 'address1 es campo requerido' })
  @IsString({ message: 'address1 debe ser de tipo string' })
  address1: string;

  @IsOptional()
  @IsString({ message: 'address2 debe ser de tipo string' })
  address2: string;

  @IsNotEmpty({ message: 'country es campo requerido' })
  @IsInt({ message: 'country debe ser de tipo integer' })
  country: number;

  @IsNotEmpty({ message: 'state es campo requerido' })
  @IsInt({ message: 'state debe ser de tipo integer' })
  state: number;

  @IsNotEmpty({ message: 'city es campo requerido' })
  @IsInt({ message: 'city debe ser de tipo integer' })
  city: number;
}
