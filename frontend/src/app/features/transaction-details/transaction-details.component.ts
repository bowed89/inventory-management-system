import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.css'
})
export class TransactionDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  transactionId: string | null = '';
  transaction: any = null;

  statusForm = this.fb.nonNullable.group({
    status: ['', Validators.required]
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.transactionId = params['transactionId'];
      console.log(this.transactionId);

      this.getTransactionDetails();
    })

  }

  getTransactionDetails(): void {
    if (this.transactionId) {
      this.apiService.getTransactionById(this.transactionId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.transaction = res.data;
            this.statusForm.setValue({ status: this.transaction.status });
          }
        },
        error: (error: any) => {
          this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while showing transaction by id' + error, 'error');
        }
      })
    }
  }

  getImageUrl(imageUrl: string): string {
    return this.apiService.getImageUrl(imageUrl);
  }

  handleUpdateStatus(): void {
    const status = this.statusForm.value.status;

    if (this.transactionId && status) {
      this.apiService.updateTransactionStatus(this.transactionId, status).subscribe({
        next: (res: any) => {
          this.router.navigate(['/transaction']);
        },
        error: (error: any) => {
          this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while updating transaction by id' + error, 'error');
        }

      })
    }
  }
}
