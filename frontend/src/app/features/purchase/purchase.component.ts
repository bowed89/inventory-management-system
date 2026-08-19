import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent implements OnInit {
  private fb = inject(FormBuilder);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  products: any[] = [];
  suppliers: any[] = [];

  purchaseForm = this.fb.nonNullable.group({
    productId: ['', Validators.required],
    supplierId: ['', Validators.required],
    description: [''],
    quantity: ['', Validators.required],
  });

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
        this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while showing products', 'error');
      }
    });

    this.apiService.getAllSuppliers().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.suppliers = res.data;
        }
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while showing suppliers', 'error');
      }
    });

  }

  handleSubmit(): void {
    if (this.purchaseForm.invalid) {
      this.notificationService.show('Please fill in all fields', 'error');
      return;
    }

    const formValue = this.purchaseForm.getRawValue();
    const body = {
      productId: formValue.productId!,
      supplierId: formValue.supplierId!,
      description: formValue.description ?? '',
      quantity: parseInt(formValue.quantity!, 10)
    }

    this.apiService.purchaseProduct(body).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.notificationService.show(res.message, "success");
          this.resetForm();
        }
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while purchasing product', 'error');
      }
    });
  }

  resetForm(): void {
    this.purchaseForm.reset();
  }

}
