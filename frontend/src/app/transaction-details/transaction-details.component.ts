import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.css'
})
export class TransactionDetailsComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  transactionId: string | null = '';
  transaction: any = null;
  status: string = '';
  message: string = '';

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
            this.status = res.status;
          }
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || 'An error occurred while showing transaction by id' + error);
        }
      })
    }
  }

  getImageUrl(imageUrl: string): string {
    return this.apiService.getImageUrl(imageUrl);
  }

  handleUpdateStatus(): void {
    if (this.transactionId && this.status) {
      this.apiService.updateTransactionStatus(this.transactionId, this.status).subscribe({
        next: (res: any) => {
          this.router.navigate(['/transaction']);
        },
        error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || 'An error occurred while updating transaction by id' + error);
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
