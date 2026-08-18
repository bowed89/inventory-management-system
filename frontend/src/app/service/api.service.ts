import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { Category } from '../models/category.model';
import { Supplier } from '../models/supplier.model';
import { TransactionRequestBody } from '../models/transaction-request.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private static SERVER_URL = environment.apiUrl;
  private static BASE_URL = `${ApiService.SERVER_URL}/api`;

  authStatusChanged = new EventEmitter<void>();

  constructor(
    private http: HttpClient
  ) {}

  saveToStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  private getFromStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  private clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  getToken(): string | null {
    return this.getFromStorage('token');
  }

  // authentication checker
  logout(): void {
    this.clearAuth();
  }

  isAuthenticated(): boolean {
    return !!this.getFromStorage('token');
  }

  isAdmin(): boolean {
    const role = this.getFromStorage('role');
    return role === 'ADMIN';
  }

  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) return imageUrl;
    return `${ApiService.SERVER_URL}/${imageUrl}`;
  }

  // Auth & Users API methods
  registerUser(body: RegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ApiService.BASE_URL}/auth/register`, body);
  }

  loginUser(body: LoginRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ApiService.BASE_URL}/auth/login`, body);
  }

  getLoggedInUserInfo(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ApiService.BASE_URL}/users/current`);
  }

  // Category endpoints
  createCategory(body: Partial<Category>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ApiService.BASE_URL}/categories/add`, body);
  }

  getAllCategories(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ApiService.BASE_URL}/categories/all`);
  }

  getCategoryById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ApiService.BASE_URL}/categories/${id}`);
  }

  updateCategory(id: string, body: Partial<Category>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ApiService.BASE_URL}/categories/update/${id}`, body);
  }

  deleteCategory(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ApiService.BASE_URL}/categories/delete/${id}`);
  }

  // Supplier endpoints
  addSupplier(body: Partial<Supplier>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ApiService.BASE_URL}/suppliers/add`, body);
  }

  getAllSuppliers(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ApiService.BASE_URL}/suppliers/all`);
  }

  getSupplierById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ApiService.BASE_URL}/suppliers/${id}`);
  }

  updateSupplier(id: string, body: Partial<Supplier>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ApiService.BASE_URL}/suppliers/update/${id}`, body);
  }

  deleteSupplier(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ApiService.BASE_URL}/suppliers/delete/${id}`);
  }

  // Product endpoints
  addProduct(body: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ApiService.BASE_URL}/products/add`, body);
  }

  updateProduct(body: FormData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ApiService.BASE_URL}/products/update`, body);
  }

  getAllProducts(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ApiService.BASE_URL}/products/all`);
  }

  getProductById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ApiService.BASE_URL}/products/${id}`);
  }

  deleteProduct(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ApiService.BASE_URL}/products/delete/${id}`);
  }

  // Transaction endpoints
  purchaseProduct(body: TransactionRequestBody): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ApiService.BASE_URL}/transactions/purchase`, body);
  }

  sellProduct(body: TransactionRequestBody): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ApiService.BASE_URL}/transactions/sell`, body);
  }

  getAllTransactions(searchText: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ApiService.BASE_URL}/transactions/all`, {
      params: { searchText: searchText }
    });
  }

  getTransactionById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ApiService.BASE_URL}/transactions/${id}`);
  }

  updateTransactionStatus(id: string, status: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ApiService.BASE_URL}/transactions/update/${id}`, JSON.stringify(status), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  getTransactionByMonthAndYear(month: number, year: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ApiService.BASE_URL}/transactions/by-month-year`, {
      params: { month: month, year: year }
    });
  }

}
