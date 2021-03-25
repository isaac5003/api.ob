import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { InvoiceDetail } from './InvoiceDetail';
import { Company } from './Company';
import { SellingType } from './SellingType';

@Entity('service')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'description' })
  description: string;

  @Column('double precision', { name: 'cost', precision: 53 })
  cost: number;

  @Column('boolean', { name: 'active', default: () => 'true' })
  active: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @Column('boolean', { name: 'incIva', default: () => 'false' })
  incIva: boolean;

  @Column('boolean', { name: 'incRenta', default: () => 'false' })
  incRenta: boolean;

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.service)
  invoiceDetails: InvoiceDetail[];

  @ManyToOne(() => Company, (company) => company.services)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;

  @ManyToOne(() => SellingType, (sellingType) => sellingType.services)
  @JoinColumn([{ name: 'sellingTypeId', referencedColumnName: 'id' }])
  sellingType: SellingType;
}
