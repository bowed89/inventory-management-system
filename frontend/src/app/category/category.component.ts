import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  private fb = inject(FormBuilder);

  categories: Category[] = [];
  isEditing: boolean = false;
  editingCategoryId: number | null = null;

  categoryForm = this.fb.nonNullable.group({
    name: ['', Validators.required]
  });

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getCategories();

  }

  getCategories(): void {
    this.apiService.getAllCategories().subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.categories = response.data;
        }
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'Unable to get all categories' + error);
      }
    });
  }

  addCategory(): void {
    if (this.categoryForm.invalid) {
      this.notificationService.show("Category name is required");
      return;
    }

    this.apiService.createCategory({ name: this.categoryForm.value.name! }).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.notificationService.show("Category created successfully");
          this.categoryForm.reset();
          this.getCategories();
        }
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while creating category');
      }
    });

  }

  editCategory(): void {
    if (this.categoryForm.invalid || !this.editingCategoryId) {
      return;
    }

    this.apiService.updateCategory(this.editingCategoryId.toString(), { name: this.categoryForm.value.name! }).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.notificationService.show("Category updated successfully");
          this.categoryForm.reset();
          this.isEditing = false;
          this.getCategories();
        }
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while updating category');
      }
    })

  }

  handleEditCategory(category: Category): void {
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.categoryForm.setValue({ name: category.name });
  }

  handleDeleteCategory(categoryId: number): void {
    if (window.confirm("Are you sure you want to delete this category?")) {
      this.apiService.deleteCategory(categoryId.toString()).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.notificationService.show("Category deleted successfully");
            this.getCategories();
          }
        },
        error: (error: any) => {
          this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while deleting category');
        }
      })
    }
  }

}
