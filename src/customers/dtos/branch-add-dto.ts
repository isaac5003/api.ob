import { IsNotEmpty } from 'class-validator';

export class BranchAddDTO {
  @IsNotEmpty()
  contactName: string;

  contactInfo: string;

  address1: string;

  address2: string;

  country: number;

  state: number;

  city: number;
}
