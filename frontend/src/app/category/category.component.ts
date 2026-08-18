import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

interface Category {
  id: string,
  name: string
}

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
  message: string = '';
  isEditing: boolean = false;
  editingCategoryId: string | null = null;

  constructor(
    private apiService: ApiService
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
        this.showMessage(error?.error?.message || error?.message || 'Unable to get all categories' + error);
      }
    });
  }

  addCategory(): void {
    if (!this.categoryName) {
      this.showMessage("Category name is required");
      return;
    }

    this.apiService.createCategory({ name: this.categoryName }).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage("Category created successfully");
          this.categoryName = '';
          this.getCategories();
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || 'An error occurred while creating category');
      }
    });

  }

  editCategory(): void {
    if (!this.categoryName || !this.editingCategoryId) {
      return;
    }

    this.apiService.updateCategory(this.editingCategoryId, { name: this.categoryName }).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage("Category updated successfully");
          this.categoryName = '';
          this.isEditing = false;
          this.getCategories();
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || 'An error occurred while updating category');
      }
    })

  }

  handleEditCategory(category: Category): void {
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.categoryName = category.name;
  }

  handleDeleteCategory(categoryId: string): void {
    if (window.confirm("Are you sure you want to delete this category?")) {
      this.apiService.deleteCategory(categoryId).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.showMessage("Category deleted successfully");
            this.getCategories();
          }
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || 'An error occurred while deleting category');
        }
      })
    }
  }

  showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

}
