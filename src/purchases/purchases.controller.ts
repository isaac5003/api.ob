import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
@UseGuards(AuthGuard())
export class PurchasesController {
  constructor(private purchase: PurchasesService) {}
}
