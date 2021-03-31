import { Transform } from 'class-transformer';
import { IsBooleanString, IsNotEmpty } from 'class-validator';

export class serviceStatusDTO {
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsBooleanString()
  active: boolean;
}
