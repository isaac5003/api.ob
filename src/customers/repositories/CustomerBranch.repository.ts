import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { BranchDataDTO } from '../dtos/customer-branch.dto';
import { CustomerBranch } from '../entities/CustomerBranch.entity';
import { CustomerIdDTO } from '../dtos/customer-id.dto';

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

  async createBranch(data: BranchDataDTO[], type: string): Promise<CustomerBranch[]> {
    // crea sucursal
    let response: CustomerBranch[];
    try {
      const branch = this.create([...data]);
      response = await this.save(branch);
    } catch (error) {
      console.error(error);

      logDatabaseError(type, error);
    }
    return await response;
  }

  async updateBranch(id: string, data: Partial<BranchDataDTO>, type): Promise<any> {
    try {
      return this.update({ id }, data);
    } catch (error) {
      console.error(error);
      logDatabaseError(type, error);
    }
  }

  async deleteBranch(id: string, type: string): Promise<any> {
    try {
      return await this.delete({ id });
    } catch (error) {
      console.error(error);
      logDatabaseError(type, error);
    }
  }

  async getCustomerCustomerBranch(id: string, type: string, customerId: string): Promise<CustomerBranch> {
    let customerBranch: CustomerBranch;
    const leftJoinAndSelect = {
      c: 'cb.country',
      s: 'cb.state',
      ct: 'cb.city',
    };

    try {
      customerBranch = await this.findOneOrFail({
        where: { id: id, customer: customerId },
        join: {
          alias: 'cb',
          leftJoinAndSelect,
        },
      });
    } catch (error) {
      console.error(error);
      logDatabaseError(`sucursal del ${type}`, error);
    }
    return customerBranch;
  }
}
