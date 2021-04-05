import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { City } from 'src/system/entities/City.entity';
import { Country } from 'src/system/entities/Country.entity';
import { State } from 'src/system/entities/State.entity';
import { validationMessage } from 'src/_tools';

export class BranchDataDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  @IsString({ message: validationMessage('name', 'IsString') })
  name: string;

  @IsNotEmpty({ message: validationMessage('contactName', 'IsNotEmpty') })
  @IsString({ message: validationMessage('contactName', 'IsString') })
  contactName: string;

  @IsOptional()
  @IsString({ message: validationMessage('contactInfo', 'IsBooleanString') })
  contactInfo: string;

  @IsNotEmpty({ message: validationMessage('address1', 'IsNotEmpty') })
  @IsString({ message: validationMessage('address1', 'IsString') })
  address1: string;

  @IsOptional()
  @IsString({ message: validationMessage('address2', 'IsString') })
  address2: string;

  @IsNotEmpty({ message: validationMessage('country', 'IsNotEmpty') })
  @IsInt({ message: validationMessage('country', 'IsInt') })
  country: Country;

  @IsNotEmpty({ message: validationMessage('state', 'IsNotEmpty') })
  @IsInt({ message: validationMessage('state', 'IsInt') })
  state: State;

  @IsNotEmpty({ message: validationMessage('city', 'IsNotEmpty') })
  @IsInt({ message: validationMessage('city', 'IsInt') })
  city: City;
}
