import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Invoice } from './Invoice';
import { SellingType } from './SellingType';
import { Service } from './Service';

@Entity('invoice_detail')
export class InvoiceDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'chargeDescription' })
  chargeDescription: string;

  @Column('double precision', { name: 'quantity', precision: 53 })
  quantity: number;

  @Column('double precision', { name: 'unitPrice', precision: 53 })
  unitPrice: number;

  @Column('boolean', { name: 'incTax' })
  incTax: boolean;

  @Column('double precision', { name: 'ventaPrice', precision: 53 })
  ventaPrice: number;

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

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceDetails)
  @JoinColumn([{ name: 'invoiceId', referencedColumnName: 'id' }])
  invoice: Invoice;

  @ManyToOne(() => SellingType, (sellingType) => sellingType.invoiceDetails)
  @JoinColumn([{ name: 'sellingTypeId', referencedColumnName: 'id' }])
  sellingType: SellingType;

  @ManyToOne(() => Service, (service) => service.invoiceDetails)
  @JoinColumn([{ name: 'serviceId', referencedColumnName: 'id' }])
  service: Service;
}
