import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.css'
})

export class AddEditProductComponent implements OnInit {
  private fb = inject(FormBuilder);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  productId: string | null = null;
  imageFile: File | null = null;
  imageUrl: string = '';
  isEditing: boolean = false;
  categories: any[] = [];

  productForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    price: ['', Validators.required],
    stockQuantity: ['', Validators.required],
    categoryId: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.fetchCategories();

    if (this.productId) {
      this.isEditing = true;
      this.fetchProductById(this.productId);
    }
  }

  fetchCategories(): void {
    this.apiService.getAllCategories().subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.categories = response.data;
        }
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while showing categories');
      }
    })
  }

  fetchProductById(productId: string): void {
    this.apiService.getProductById(productId).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          const product = response.data;

          this.productForm.setValue({
            name: product.name,
            sku: product.sku,
            price: product.price,
            stockQuantity: product.stockQuantity,
            categoryId: product.categoryId,
            description: product.description,
          });
          this.imageUrl = product.imageUrl;

        } else {
          this.notificationService.show(response.message);
        }
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while showing categories');
      }
    })
  }

  getImageUrl(imageUrl: string): string {
    return this.apiService.getImageUrl(imageUrl);
  }

  handleImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files?.[0]) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageUrl = reader.result as string;
      }
      reader.readAsDataURL(this.imageFile);
    }
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    if (this.productForm.invalid) {
      this.notificationService.show('Please fill in all required fields');
      return;
    }

    const formValue = this.productForm.getRawValue();
    const formData = new FormData();

    formData.append("name", formValue.name!);
    formData.append("sku", formValue.sku!);
    formData.append("price", formValue.price!);
    formData.append("stockQuantity", formValue.stockQuantity!);
    formData.append("categoryId", formValue.categoryId!);
    formData.append("description", formValue.description!);

    if (this.imageFile) {
      formData.append("imageFile", this.imageFile);
    }

    if (this.isEditing) {
      formData.append("productId", this.productId!);

      this.apiService.updateProduct(formData).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.notificationService.show("Product updated successfully");
            this.router.navigate(['/product']);
          }
        },
        error: (error: any) => {
          this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while updating a product');
        }
      })

    } else {
      this.apiService.addProduct(formData).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.notificationService.show("Product saved successfully");
            this.router.navigate(['/product']);
          }
        },
        error: (error: any) => {
          this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while saving a product');
        }
      })
    }

  }

}
