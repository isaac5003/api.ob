import { EntityRepository, Repository } from 'typeorm';
import { ServiceSetting } from '../entities/ServiceSetting.entity';

@EntityRepository(ServiceSetting)
export class ServiceSettingRepository extends Repository<ServiceSetting> {}
