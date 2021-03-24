import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Company } from './Company';

@Entity('accounting_setting')
export class AccountingSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'type', nullable: true })
  type: string | null;

  @Column('json', { name: 'settings', nullable: true })
  settings: object | null;

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

  @Column('json', { name: 'balanceGeneral', nullable: true })
  balanceGeneral: object | null;

  @Column('json', { name: 'estadoResultados', nullable: true })
  estadoResultados: object | null;

  @Column('date', { name: 'periodStart', nullable: true })
  periodStart: string | null;

  @Column('date', { name: 'peridoEnd', nullable: true })
  peridoEnd: string | null;

  @Column('character varying', { name: 'legal', nullable: true })
  legal: string | null;

  @Column('character varying', { name: 'accountant', nullable: true })
  accountant: string | null;

  @Column('character varying', { name: 'auditor', nullable: true })
  auditor: string | null;

  @ManyToOne(() => Company, (company) => company.accountingSettings)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;
}
