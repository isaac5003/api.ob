import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { BranchDataDTO } from '../dtos/customer-branch.dto';
import { CustomerBranch } from '../entities/CustomerBranch.entity';

const reponame = 'sucursal';
@EntityRepository(CustomerBranch)
export class CustomerBranchRepository extends Repository<CustomerBranch> {
  async getCustomerBranches(id: string): Promise<CustomerBranch[]> {
    let branches: CustomerBranch[];
    try {
      branches = await this.find({ id });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return branches;
  }

  async createBranch(id: string, data: BranchDataDTO): Promise<CustomerBranch> {
    // crea sucursal
    let response: CustomerBranch;
    try {
      const branch = this.create({ id, ...data });
      response = await this.save(branch);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async updateBranch(id: string, data: BranchDataDTO): Promise<any> {
    return this.update({ id }, data);
  }

  async getCustomerCustomerBranch(id: string): Promise<CustomerBranch> {
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
      logDatabaseError(reponame, error);
    }
    return customerBranch;
  }
}
