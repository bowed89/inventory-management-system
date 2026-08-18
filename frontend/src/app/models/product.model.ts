import { Category } from './category.model';

export interface Product {
  id: number;
  productId?: number;
  categoryId?: number;
  supplierId?: number;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  description?: string;
  imageUrl?: string;
  expiryDate?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
}
