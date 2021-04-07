import { Company } from 'src/companies/entities/Company.entity';
import { Service } from '../entities/Service.entity';

export class ServiceReportGeneralDTO {
  company: Partial<Company>;
  services: Service[];
}
