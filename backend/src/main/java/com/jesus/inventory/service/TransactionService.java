package com.jesus.inventory.service;


import com.jesus.inventory.dto.ApiResponse;
import com.jesus.inventory.dto.TransactionDTO;
import com.jesus.inventory.dto.TransactionRequest;
import com.jesus.inventory.enums.TransactionStatus;

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
