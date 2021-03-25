import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from './Company';
import { CustomerTaxerType } from './CustomerTaxerType';
import { CustomerType } from './CustomerType';
import { CustomerTypeNatural } from './CustomerTypeNatural';
import { CustomerBranch } from './CustomerBranch';
import { Invoice } from './Invoice';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'shortName' })
  shortName: string;

  @Column('boolean', { name: 'isCustomer' })
  isCustomer: boolean;

  @Column('boolean', { name: 'isProvider' })
  isProvider: boolean;

  @Column('boolean', { name: 'isActiveCustomer', default: () => 'true' })
  isActiveCustomer: boolean;

  @Column('boolean', { name: 'isActiveProvider', default: () => 'true' })
  isActiveProvider: boolean;

  @Column('character varying', { name: 'dui', nullable: true })
  dui: string;

  @Column('character varying', { name: 'nrc', nullable: true })
  nrc: string;

  @Column('character varying', { name: 'nit', nullable: true })
  nit: string;

  @Column('character varying', { name: 'giro', nullable: true })
  giro: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => Company, (company) => company.customers)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;

  @ManyToOne(
    () => CustomerTaxerType,
    (customerTaxerType) => customerTaxerType.customers,
  )
  @JoinColumn([{ name: 'customerTaxerTypeId', referencedColumnName: 'id' }])
  customerTaxerType: CustomerTaxerType;

  @ManyToOne(() => CustomerType, (customerType) => customerType.customers)
  @JoinColumn([{ name: 'customerTypeId', referencedColumnName: 'id' }])
  customerType: CustomerType;

  @ManyToOne(
    () => CustomerTypeNatural,
    (customerTypeNatural) => customerTypeNatural.customers,
  )
  @JoinColumn([{ name: 'customerTypeNaturalId', referencedColumnName: 'id' }])
  customerTypeNatural: CustomerTypeNatural;

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.customer)
  customerBranches: CustomerBranch[];

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];
}
