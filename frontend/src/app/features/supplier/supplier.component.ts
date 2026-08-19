import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  suppliers: any[] = [];

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.apiService.getAllSuppliers().subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.suppliers = response.data;

        } else {
          this.notificationService.show(response.message, "error");
        }
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'Unable to get all suppliers' + error, 'error');
      }
    });
  }

  navigateToAddSupplierPage() {
    this.router.navigate(['/add-supplier']);
  }

  navigateToEditSupplierPage(supplierId: string) {
    this.router.navigate([`/edit-supplier/${supplierId}`]);
  }

  handleDeleteSupplier(supplierId: string): void {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      this.apiService.deleteSupplier(supplierId).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.notificationService.show("Supplier deleted successfully", "success");
            this.getSuppliers();
          }
        },
        error: (error: any) => {
          this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while deleting supplier' + error, 'error');
        }
      })
    }
  }

}
