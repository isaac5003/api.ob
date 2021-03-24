import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Invoice } from './Invoice';
import { Company } from './Company';

@Entity('invoices_payments_condition')
export class InvoicesPaymentsCondition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('boolean', { name: 'active', default: () => 'true' })
  active: boolean;

  @Column('timestamp without time zone', {
    name: 'createdAt',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'updatedAt',
    default: () => 'now()',
  })
  updatedAt: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.invoicesPaymentsCondition)
  invoices: Invoice[];

  @ManyToOne(() => Company, (company) => company.invoicesPaymentsConditions)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;
}
