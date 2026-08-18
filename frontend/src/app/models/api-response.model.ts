import { Category } from './category.model';
import { Product } from './product.model';
import { Supplier } from './supplier.model';
import { Transaction } from './transaction.model';
import { User, UserRole } from './user.model';

export interface ApiResponse {
  status: number;
  message: string;

  token?: string;
  role?: UserRole;
  expirationTime?: string;

  totalPages?: number;
  totalElement?: number;

  user?: User;
  users?: User[];

  supplier?: Supplier;
  suppliers?: Supplier[];

  category?: Category;
  categories?: Category[];

  product?: Product;
  products?: Product[];

  transaction?: Transaction;
  transactions?: Transaction[];

  timestamp?: string;
}
