import { Product } from './product.model';
import { Supplier } from './supplier.model';
import { User } from './user.model';

export type TransactionType = 'PURCHASE' | 'SALE' | 'RETURN_SUPPLIER';
export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELED';

export interface Transaction {
  id: number;
  totalProducts?: number;
  totalPrice?: number;
  transactionType?: TransactionType;
  status?: TransactionStatus;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  product?: Product;
  supplier?: Supplier;
}
