import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { BranchDataDTO } from '../dtos/customer-branch.dto';
import { CustomerBranch } from '../entities/CustomerBranch.entity';

@EntityRepository(CustomerBranch)
export class CustomerBranchRepository extends Repository<CustomerBranch> {
  async getCustomerBranches(id: string, type: string): Promise<CustomerBranch[]> {
    let branches: CustomerBranch[];
    try {
      branches = await this.find({
        where: { customer: id },
        join: {
          alias: 'branch',
          leftJoinAndSelect: {
            counttry: 'branch.country',
            state: 'branch.state',
            city: 'branch.city',
          },
        },
      });
    } catch (error) {
      logDatabaseError(type, error);
    }
    return branches;
  }

  async createBranch(data: BranchDataDTO, type: string): Promise<CustomerBranch> {
    // crea sucursal
    let response: CustomerBranch;
    try {
      const branch = this.create({ ...data });
      response = await this.save(branch);
    } catch (error) {
      logDatabaseError(type, error);
    }
    return await response;
  }

  async updateBranch(id: string, data: BranchDataDTO, type): Promise<any> {
    return this.update({ id }, data);
  }

  async getCustomerCustomerBranch(id: string, type: string): Promise<CustomerBranch> {
    let customerBranch: CustomerBranch;
    const leftJoinAndSelect = {
      c: 'cb.country',
      s: 'cb.state',
      ct: 'cb.city',
    };

    try {
      customerBranch = await this.findOneOrFail(
        { id },
        {
          join: {
            alias: 'cb',
            leftJoinAndSelect,
          },
        },
      );
    } catch (error) {
      console.error(error);
      logDatabaseError(type, error);
    }
    return customerBranch;
  }
}
