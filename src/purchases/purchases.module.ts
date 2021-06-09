import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { PurchaseRepository } from './repositories/Purchase.repository';
import { PurchaseDetailRepository } from './repositories/PurchaseDetail.repository';
import { PurchasesDocumentTypeRepository } from './repositories/PurchaseDocumentType.repository';
import { PurchasesPaymentsConditionRepository } from './repositories/PurchasePaymentsCondition.repository';
import { PurchasesStatusRepository } from './repositories/PurchaseStatus.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      PurchasesStatusRepository,
      PurchaseRepository,
      PurchaseDetailRepository,
      PurchasesDocumentTypeRepository,
      PurchasesPaymentsConditionRepository,
    ]),
  ],
  providers: [PurchasesService],
  controllers: [PurchasesController],
})
export class PurchasesModule {}
