import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchasesDocumentType } from './entities/PurchasesDocumentType.entity';
import { PurchasesStatus } from './entities/PurchasesStatus.entity';
import { PurchasesDocumentTypeRepository } from './repositories/PurchaseDocumentType.repository';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(PurchasesDocumentTypeRepository)
    private purchasesDocumentTypeRepository: PurchasesDocumentTypeRepository,
  ) {}

  async getPurchasesDocumentTypes(): Promise<{ data: PurchasesDocumentType[]; count: number }> {
    return await this.purchasesDocumentTypeRepository.getPurchaseDocumentTypes();
  }
}
