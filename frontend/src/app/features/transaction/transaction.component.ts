import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [PaginationComponent, FormsModule, CommonModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  transactions: any[] = [];
  searchInput: string = '';
  valueToSearch: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 3;

  ngOnInit() {
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    this.apiService.getAllTransactions(this.valueToSearch).subscribe({
      next: (res: any) => {
        const transactions = res.data || [];

        this.totalPages = Math.ceil(transactions.length / this.itemsPerPage);
        this.transactions = transactions.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
      },
      error: (error: any) => {
        this.notificationService.show(error?.error?.message || error?.message || 'An error occurred while showing transactions', 'error');
      }
    })
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.valueToSearch = this.searchInput;
    this.fetchTransactions();
  }

  navigateToTransactionDetailsPage(transactionId: string): void {
    this.router.navigate([`/transaction/${transactionId}`]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchTransactions();
  }

}
