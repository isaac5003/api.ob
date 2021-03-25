import { EntityRepository, Repository } from 'typeorm';
import { CustomerSetting } from '../entities/CustomerSetting.entity';

@EntityRepository(CustomerSetting)
export class CustomerSettingRepository extends Repository<CustomerSetting> {}
