import { IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class WorkSpaceDTO {
  @IsNotEmpty({ message: validationMessage('cid', 'IsNotEmpty') })
  cid: string;

  @IsNotEmpty({ message: validationMessage('bid', 'IsNotEmpty') })
  bid: string;
}
