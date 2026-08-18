package com.jesus.inventory.transaction;


import com.jesus.inventory.common.ApiResponse;
import com.jesus.inventory.transaction.TransactionDTO;
import com.jesus.inventory.transaction.TransactionRequest;
import com.jesus.inventory.transaction.TransactionStatus;

import java.util.List;

public interface TransactionService {
    ApiResponse<Void> restockInventory(TransactionRequest transactionRequest);
    ApiResponse<Void> sell(TransactionRequest transactionRequest);
    ApiResponse<Void> returnToSupplier(TransactionRequest transactionRequest);
    ApiResponse<List<TransactionDTO>> getAllTransactions(int page, int size, String searchText);
    ApiResponse<TransactionDTO> getTransactionById(Long id);
    ApiResponse<List<TransactionDTO>> getAllTransactionsByMonthAndYear(int month, int year);
    ApiResponse<Void> updateTransactionStatus(Long transactionId, TransactionStatus transactionStatus);

}
