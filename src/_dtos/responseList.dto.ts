import { Company } from 'src/companies/entities/Company.entity';

export class ResponseListDTO<T> {
  count: number;
  data: T[];

  constructor(data: T[]) {
    let index = 1;
    this.count = data.length;
    this.data = data.map((d) => {
      return {
        index: index++,
        ...d,
      };
    });
  }
}

export class ResponseSingleDTO<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}

export class ResponseMinimalDTO {
  id?: string;
  ids?: string[];
  integrations?: any;
  message?: string;
  nextSerie?: number;
}

export class ResponseUserDTO {
  user: any;
}

export class ServiceReportGeneralDTO {
  company: Partial<Company>;
  services: any[];
}

export class ReportsDTO {
  company: Partial<Company>;
  invoices: any[];
}
