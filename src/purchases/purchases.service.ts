import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchasesStatus } from './entities/PurchasesStatus.entity';
import { PurchasesStatusRepository } from './repositories/PurchasesStatus.repository';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(PurchasesStatusRepository)
    private purchaseStatusRepository: PurchasesStatusRepository,
  ) {}

  async getPurchasesStatuses(): Promise<PurchasesStatus[]> {
    return await this.purchaseStatusRepository.getPurchasesStatuses();
  }
}
