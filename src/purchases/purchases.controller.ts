import { Controller, Get, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { ResponseListDTO } from 'src/_dtos/responseList.dto';
import { PurchasesDocumentType } from './entities/PurchasesDocumentType.entity';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
@UseGuards(AuthGuard())
export class PurchasesController {
  constructor(private purchase: PurchasesService) {}

  @Get('/document-types')
  async getPurchasesDocumentTypes(): Promise<ResponseListDTO<PurchasesDocumentType, number, number, number>> {
    const { data, count } = await this.purchase.getPurchasesDocumentTypes();
    return new ResponseListDTO(plainToClass(PurchasesDocumentType, data), count);
  }
}
