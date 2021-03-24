import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Invoice } from './Invoice';
import { InvoicesSeller } from './InvoicesSeller';
import { Company } from './Company';

@Entity('invoices_zone')
export class InvoicesZone {
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

  @OneToMany(() => Invoice, (invoice) => invoice.invoicesZone)
  invoices: Invoice[];

  @OneToMany(
    () => InvoicesSeller,
    (invoicesSeller) => invoicesSeller.invoicesZone,
  )
  invoicesSellers: InvoicesSeller[];

  @ManyToOne(() => Company, (company) => company.invoicesZones)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;
}
