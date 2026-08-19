import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css'
})
export class SellComponent implements OnInit {
  private fb = inject(FormBuilder);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }


  products: any[] = [];

  sellForm = this.fb.nonNullable.group({
    productId: ['', Validators.required],
    description: [''],
    quantity: ['', Validators.required],
  });


  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.apiService.getAllProducts().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.products = res.data;
        }
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while showing products', 'error');
      }
    });

  }

  handleSubmit(): void {
    if (this.sellForm.invalid) {
      this.notificationService.show('Please fill in all fields', 'error');
      return;
    }

    const formValue = this.sellForm.getRawValue();
    const body = {
      productId: formValue.productId!,
      description: formValue.description ?? '',
      quantity: parseInt(formValue.quantity!, 10)
    }

    this.apiService.sellProduct(body).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.notificationService.show(res.message, "success");
          this.resetForm();
        }
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while selling product', 'error');
      }
    });
  }

  resetForm(): void {
    this.sellForm.reset();
  }

}
