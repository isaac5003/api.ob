import { EntityRepository, Repository } from 'typeorm';
import { ServiceSetting } from './ServiceSetting.entity';

@EntityRepository(ServiceSetting)
export class ServiceSettingRepository extends Repository<ServiceSetting> {}
