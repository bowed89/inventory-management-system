import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private static SERVER_URL = 'http://localhost:8080';
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

  private getHeaders(): HttpHeaders {
    const token = this.getFromStorage('token');

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

  }

  // authentication checker
  logout(): void {
    this.clearAuth();
  }

  isAuthenticated(): boolean {
    const token = this.getFromStorage('token');
    return !!token;
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
  registerUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/register`, body);
  }

  loginUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/login`, body);
  }

  getLoggedInUserInfo(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/users/current`, {
      headers: this.getHeaders()
    });
  }

  // Category endpoints
  createCategory(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/categories/add`, body, {
      headers: this.getHeaders()
    });
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/categories/all`, {
      headers: this.getHeaders()
    });
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/categories/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateCategory(id: string, body: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/categories/update/${id}`, body, {
      headers: this.getHeaders()
    });
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/categories/delete/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Supplier endpoints
  addSupplier(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/suppliers/add`, body, {
      headers: this.getHeaders()
    });
  }

  getAllSuppliers(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/suppliers/all`, {
      headers: this.getHeaders()
    });
  }

  getSupplierById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/suppliers/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateSupplier(id: string, body: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/suppliers/update/${id}`, body, {
      headers: this.getHeaders()
    });
  }

  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/suppliers/delete/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Product endpoints
  addProduct(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/products/add`, body, {
      headers: this.getHeaders()
    });
  }

  updateProduct(body: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/products/update`, body, {
      headers: this.getHeaders()
    });
  }

  getAllProducts(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/products/all`, {
      headers: this.getHeaders()
    });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/products/${id}`, {
      headers: this.getHeaders()
    });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/products/delete/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Transaction endpoints
  purchaseProduct(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/transactions/purchase`, body, {
      headers: this.getHeaders()
    });
  }

  sellProduct(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/transactions/sell`, body, {
      headers: this.getHeaders()
    });
  }

  getAllTransactions(searchText: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/all`, {
      params: { searchText: searchText },
      headers: this.getHeaders()
    });
  }

  getTransactionById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateTransactionStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/transactions/update/${id}`, JSON.stringify(status), {
      headers: this.getHeaders().set('Content-Type', 'application/json')
    });
  }

  getTransactionByMonthAndYear(month: number, year: number): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/by-month-year`, {
      params: { month: month, year: year },
      headers: this.getHeaders()
    });
  }




}
