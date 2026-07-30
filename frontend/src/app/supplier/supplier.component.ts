import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
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
    private router: Router
  ) { }

  suppliers: any[] = [];
  message: string = '';

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.apiService.getAllSuppliers().subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.suppliers = response.suppliers;

        } else {
          this.showMessage(response.message);
        }
      },
      error: (error: any) => {
        this.showMessage(error?.error?.message || error?.message || 'Unable to get all suppliers' + error);
      }
    });
  }

  showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => {
      this.message = '';
    }, 3000);
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
            this.showMessage("Supplier deleted successfully");
            this.getSuppliers();
          }
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || 'An error occurred while deleting supplier' + error);
        }
      })
    }
  }

}
