import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { ResponseListDTO } from 'src/_dtos/responseList.dto';
import { PurchasesStatus } from './entities/PurchasesStatus.entity';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
@UseGuards(AuthGuard())
export class PurchasesController {
  constructor(private purchase: PurchasesService) {}

  // @Get('/status')
  // async getPurchasesStatus(): Promise<ResponseListDTO<PurchasesStatus>> {
  //   const purchases = await this.purchase.getPurchasesStatuses();
  //   return new ResponseListDTO(plainToClass(PurchasesStatus, purchases));
  // }
}
