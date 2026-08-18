import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.css'
})

export class AddEditProductComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  productId: string | null = null;
  name: string = '';
  sku: string = '';
  price: string = '';
  stockQuantity: string = '';
  categoryId: string = '';
  description: string = '';
  imageFile: File | null = null;
  imageUrl: string = '';
  isEditing: boolean = false;
  categories: any[] = [];

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

          this.name = product.name;
          this.sku = product.sku;
          this.price = product.price;
          this.stockQuantity = product.stockQuantity;
          this.categoryId = product.categoryId;
          this.description = product.description;
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
    const formData = new FormData();

    formData.append("name", this.name);
    formData.append("sku", this.sku);
    formData.append("price", this.price);
    formData.append("stockQuantity", this.stockQuantity);
    formData.append("categoryId", this.categoryId);
    formData.append("description", this.description);

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
