import { Invoice } from 'src/invoices/entities/Invoice.entity';
import { Connection, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `
  SELECT 
    p.id AS id, p.authorization AS authorization, p.sequence AS sequence, p."providerName" AS name, p.iva AS iva, pdt.name AS "documentType", p.origin AS origin, 'purchases' AS type
  FROM purchase p 
  LEFT JOIN purchases_document_type pdt ON pdt.id = p."documentTypeId"
  UNION ALL
  SELECT 
    i.id AS id, i.authorization AS authorization, i.sequence AS sequence, i."customerName" AS name, i.iva AS iva, idt.name AS "documentType", i.origin AS origin, 'invoices' AS type
  FROM invoice i 
  LEFT JOIN invoices_document_type idt ON idt.id = i."documentTypeId";
 `,
})
export class TaxesView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  date: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  authorization: string;

  @ViewColumn()
  sequence: string;

  @ViewColumn()
  documentType: string;

  @ViewColumn()
  type: string;

  @ViewColumn()
  origin: string;

  @ViewColumn()
  iva: number;
}
