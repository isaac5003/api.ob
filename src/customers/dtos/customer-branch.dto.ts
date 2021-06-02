import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { City } from '../../system/entities/City.entity';
import { Country } from '../../system/entities/Country.entity';
import { State } from '../../system/entities/State.entity';
import { validationMessage } from '../../_tools';

export class BranchDataDTO {
  @IsOptional()
  @IsString({ message: validationMessage('name', 'IsString') })
  name: string;

  @IsOptional()
  @IsString({ message: validationMessage('contactName', 'IsString') })
  contactName: string;

  @IsOptional()
  contactInfo: { phones: string[]; emails: string[] };

  @IsOptional()
  @IsBoolean({ message: validationMessage('default', 'IsBoolean') })
  default: boolean;

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
