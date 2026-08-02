import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css'
})
export class SellComponent implements OnInit {

  constructor(private apiService: ApiService) { }


  products: any[] = [];
  productId: string = '';
  description: string = '';
  quantity: string = '';
  message: string = '';


  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.apiService.getAllProducts().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.products = res.products;
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || 'An error occurred while showing products');
      }
    });

  }

  handleSubmit(): void {
    if (!this.productId || !this.quantity) {
      this.showMessage('Please fill in all fields');
      return;
    }

    const body = {
      productId: this.productId,
      description: this.description,
      quantity: parseInt(this.quantity, 10)
    }

    this.apiService.sellProduct(body).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage(res.message);
          this.resetForm();
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || 'An error occurred while selling product');
      }
    });
  }

  resetForm(): void {
    this.productId = '';
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
