import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { PurchasesStatusRepository } from './repositories/PurchasesStatus.repository';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([PurchasesStatusRepository])],
  providers: [PurchasesService],
  controllers: [PurchasesController],
})
export class PurchasesModule {}
