import { BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AccountingCatalog } from '../entities/AccountingCatalog.entity';

@EntityRepository(AccountingCatalog)
export class AccountingCatalogRepository extends Repository<AccountingCatalog> {
  async getAccountingCatalogById(id: string): Promise<AccountingCatalog> {
    // Get account
    const account = await this.createQueryBuilder('ac')
      // .where('ac.company = :company', { company: req.user.cid })
      .andWhere('ac.id  = :id', { id })
      .getOne();

    // If no exist
    if (!account) {
      throw new BadRequestException('La cuenta seleccionada no existe.');
    }

    return account;
  }
}
