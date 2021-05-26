import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { SellingType } from '../entities/SellingType.entity';

const reponame = 'tipo de venta';
@EntityRepository(SellingType)
export class SellingTypeRepository extends Repository<SellingType> {
  async getSellyingTypes(): Promise<SellingType[]> {
    try {
      const sellyngTypes = await this.find({ order: { id: 'DESC' } });

      return sellyngTypes;
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
  }

  async getSellingType(id: number): Promise<SellingType> {
    let sellingType: SellingType;

    try {
      sellingType = await this.findOneOrFail({ id });
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return sellingType;
  }
}
