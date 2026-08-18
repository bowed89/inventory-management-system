import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categories: Category[] = [];
  categoryName: string = '';
  isEditing: boolean = false;
  editingCategoryId: number | null = null;

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
    if (!this.categoryName) {
      this.notificationService.show("Category name is required");
      return;
    }

    this.apiService.createCategory({ name: this.categoryName }).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.notificationService.show("Category created successfully");
          this.categoryName = '';
          this.getCategories();
        }
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while creating category');
      }
    });

  }

  editCategory(): void {
    if (!this.categoryName || !this.editingCategoryId) {
      return;
    }

    this.apiService.updateCategory(this.editingCategoryId.toString(), { name: this.categoryName }).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.notificationService.show("Category updated successfully");
          this.categoryName = '';
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
    this.categoryName = category.name;
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
