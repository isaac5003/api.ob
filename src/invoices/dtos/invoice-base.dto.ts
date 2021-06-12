export class InvoiceBaseDTO {
  authorization: string;
  sequence: number;
  sum: number;
  iva: number;
  subtotal: number;
  ivaRetenido: number;
  ventasExentas: number;
  ventasNoSujetas: number;
  ventaTotal: number;
  ventaTotalText: string;
  invoiceDate: string;
  customer: string;
  customerBranch: string;
  invoicesPaymentsCondition: string;
  invoicesSeller: string;
  invoicesZone: string;
  status: number;
  customerType: string;
  customerTypeNatural: string;
  documentType: number;
}
