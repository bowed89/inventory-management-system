import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  products: any[] = [];
  suppliers: any[] = [];
  productId: string = '';
  supplierId: string = '';
  description: string = '';
  quantity: string = '';
  message: string = '';

  ngOnInit(): void {
    this.fetchProductsAndSuppliers();
  }

  fetchProductsAndSuppliers(): void {
    this.apiService.getAllProducts().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.products = res.data;
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || 'An error occurred while showing products');
      }
    });

    this.apiService.getAllSuppliers().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.suppliers = res.data;
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || 'An error occurred while showing suppliers');
      }
    });

  }

  handleSubmit(): void {
    if (!this.productId || !this.supplierId || !this.quantity) {
      this.showMessage('Please fill in all fields');
      return;
    }

    const body = {
      productId: this.productId,
      supplierId: this.supplierId,
      description: this.description,
      quantity: parseInt(this.quantity, 10)
    }

    this.apiService.purchaseProduct(body).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage(res.message);
          this.resetForm();
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || 'An error occurred while purchasing product');
      }
    });
  }

  resetForm(): void {
    this.productId = '';
    this.supplierId = '';
    this.description = '';
    this.quantity = '';
  }

  showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

}
