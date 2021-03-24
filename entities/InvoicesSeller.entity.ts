import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Invoice } from './Invoice';
import { Company } from './Company';
import { InvoicesZone } from './InvoicesZone';

@Entity('invoices_seller')
export class InvoicesSeller {
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

  @OneToMany(() => Invoice, (invoice) => invoice.invoicesSeller)
  invoices: Invoice[];

  @ManyToOne(() => Company, (company) => company.invoicesSellers)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;

  @ManyToOne(() => InvoicesZone, (invoicesZone) => invoicesZone.invoicesSellers)
  @JoinColumn([{ name: 'invoicesZoneId', referencedColumnName: 'id' }])
  invoicesZone: InvoicesZone;
}
