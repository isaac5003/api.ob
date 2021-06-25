import { Invoice } from 'src/invoices/entities/Invoice.entity';
import { Connection, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `
  SELECT 
    p.id AS id, p.authorization AS authorization, p.sequence AS sequence,p."providerId" AS "customerId", p."providerName" AS name, p.iva AS iva,pdt.id AS "documentTypeId", pdt.name AS "documentType", p.origin AS origin, 'purchases' AS type, p."companyId" AS company,
    p."purchaseDate" AS date, p."createdAt" AS "createdAt", p."sum" AS "sum"
  FROM purchase p 
  LEFT JOIN purchases_document_type pdt ON pdt.id = p."documentTypeId"
  LEFT JOIN company company ON company.id = p."companyId"
  UNION ALL
  SELECT 
    i.id AS id, i.authorization AS authorization, i.sequence AS sequence,i."customerId" AS "customerId", i."customerName" AS name, i.iva AS iva,idt.id AS "documentTypeId", idt.name AS "documentType", i.origin AS origin, 'invoices' AS type, i."companyId" AS company,
    i."invoiceDate" AS date,i."createdAt" AS "createdAt", i."sum" AS "sum" 
  FROM invoice i 
  LEFT JOIN invoices_document_type idt ON idt.id = i."documentTypeId"
  LEFT JOIN company company ON company.id = i."companyId"
  WHERE i."statusId" != 4 AND i."statusId" !=3
 
 `,
})
export class TaxesView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  date: string;

  @ViewColumn()
  customerId: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  authorization: string;

  @ViewColumn()
  sequence: string;

  @ViewColumn()
  documentType: string;

  @ViewColumn()
  documentTypeId: string;

  @ViewColumn()
  type: string;

  @ViewColumn()
  origin: string;

  @ViewColumn()
  iva: number;

  @ViewColumn()
  sum: number;

  @ViewColumn()
  company: string;

  @ViewColumn()
  createdAt: string;
}
