export interface TransactionRequestBody {
  productId: string;
  quantity: number;
  supplierId?: string;
  description?: string;
}
