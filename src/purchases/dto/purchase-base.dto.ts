export class PurchaseBaseDTO {
  authorization: string;
  sequence: number;
  sum: number;
  iva: number;
  subtotal: number;
  comprasExentas: number;
  comprasNoSujetas: number;
  compraTotal: number;
  compraTotalText: string;
  purchaseDate: string;
  provider: string;
  providerBranch: string;
  purchasePaymentsCondition: string;
  status: number;
  providerType: string;
  providerTypeNatural: string;
  documentType: number;
}
