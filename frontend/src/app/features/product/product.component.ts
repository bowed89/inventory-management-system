import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  products: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.apiService.getAllProducts().subscribe({
      next: (res: any) => {
        const products = res.data || [];
        this.totalPages = Math.ceil(products.length / this.itemsPerPage);
        this.products = products.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while showing products');
      }
    })

  }

  handleProductDelete(productId: string): void {
    if (window.confirm("Are you sure you want to delete this product?")) {
      this.apiService.deleteProduct(productId).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.notificationService.show("Product deleted successfully");
            this.fetchProducts();
          }
        },
        error: (error: any) => {
          this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while deleting product' + error);
        }
      })
    }
  }

  getImageUrl(imageUrl: string): string {
    return this.apiService.getImageUrl(imageUrl);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchProducts();
  }

  navigateToAddProductPage(): void {
    this.router.navigate(['/add-product']);
  }

  navigateToEditProductPage(productId: string): void {
    this.router.navigate([`/edit-product/${productId}`]);
  }
}
