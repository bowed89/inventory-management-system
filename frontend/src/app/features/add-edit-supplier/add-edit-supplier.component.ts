import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-add-edit-supplier',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-edit-supplier.component.html',
  styleUrl: './add-edit-supplier.component.css',
})
export class AddEditSupplierComponent implements OnInit {
  private fb = inject(FormBuilder);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router
  ) { }
  isEditing: boolean = false;
  supplierId: string | null = null;

  supplierForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
  });

  ngOnInit(): void {
    this.supplierId = this.router.url.split('/')[2]; //extracting supplier id from url
    if (this.supplierId) {
      this.isEditing = true;
      this.fetchSupplier();
    }
  }

  fetchSupplier(): void {
    this.apiService.getSupplierById(this.supplierId!).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.supplierForm.setValue({
            name: res.data.name,
            address: res.data.address,
          });
        }
      },
      error: (error) => {
        this.notificationService.show(
          error?.error?.message ||
          error?.message ||
          'Unable to get supplier by id' + error,
          'error'
        );
      },
    });
  }

  // HANDLE FORM SUBMISSION
  handleSubmit() {
    if (this.supplierForm.invalid) {
      this.notificationService.show('All fields are nessary', 'error');
      return;
    }

    if (this.isEditing) {
      this.apiService.updateSupplier(this.supplierId!, this.supplierForm.getRawValue()).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.notificationService.show("Supplier updated successfully", "success");
            this.router.navigate(['/supplier'])
          }
        },
        error: (error) => {
          this.notificationService.show(error?.error?.message || error?.message || "Unable to edit supplier" + error, "error")
        }
      })
    } else {
      this.apiService.addSupplier(this.supplierForm.getRawValue()).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.notificationService.show("Supplier Added successfully", "success");
            this.router.navigate(['/supplier'])
          }
        },
        error: (error) => {
          this.notificationService.show(error?.error?.message || error?.message || "Unable to Add supplier" + error, "error")
        }
      })
    }
  }
}
