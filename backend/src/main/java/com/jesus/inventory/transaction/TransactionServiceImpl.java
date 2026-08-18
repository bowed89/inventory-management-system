package com.jesus.inventory.transaction;

import com.jesus.inventory.common.ApiResponse;
import com.jesus.inventory.transaction.TransactionDTO;
import com.jesus.inventory.transaction.TransactionRequest;
import com.jesus.inventory.product.Product;
import com.jesus.inventory.supplier.Supplier;
import com.jesus.inventory.transaction.Transaction;
import com.jesus.inventory.user.User;
import com.jesus.inventory.transaction.TransactionStatus;
import com.jesus.inventory.transaction.TransactionType;
import com.jesus.inventory.common.InsufficientStockException;
import com.jesus.inventory.common.NameValueRequiredException;
import com.jesus.inventory.common.NotFoundException;
import com.jesus.inventory.product.ProductRepository;
import com.jesus.inventory.supplier.SupplierRepository;
import com.jesus.inventory.transaction.TransactionRepository;
import com.jesus.inventory.transaction.TransactionService;
import com.jesus.inventory.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final ModelMapper modelMapper;
    private final SupplierRepository supplierRepository;
    private final UserService userService;
    private final ProductRepository productRepository;

    @Override
    public ApiResponse<Void> restockInventory(TransactionRequest transactionRequest) {
        Long productId = transactionRequest.getProductId();
        Long supplierId = transactionRequest.getSupplierId();
        Integer quantity = transactionRequest.getQuantity();

        if(supplierId == null) throw new NameValueRequiredException("Supplier ID is required");

        Product product = productRepository.findById(productId)
                .orElseThrow(()-> new NotFoundException("Product Not Found"));

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(()-> new NotFoundException("Supplier Not Found"));

        User user =  userService.getCurrentLoggedInUser();

        // update the stock quantity and re-save
        product.setStockQuantity(product.getStockQuantity() + quantity);
        productRepository.save(product);

        // create a transaction
        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.PURCHASE)
                .status(TransactionStatus.COMPLETED)
                .product(product)
                .user(user)
                .supplier(supplier)
                .totalProducts(quantity)
                .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)))
                .description(transactionRequest.getDescription())
                .build();

        transactionRepository.save(transaction);

        return ApiResponse.<Void>builder()
                .status(200)
                .message("Transaction Created Successfully")
                .build();
    }

    @Override
    public ApiResponse<Void> sell(TransactionRequest transactionRequest) {
        Long productId = transactionRequest.getProductId();
        Integer quantity = transactionRequest.getQuantity();

        Product product = productRepository.findById(productId)
                .orElseThrow(()-> new NotFoundException("Product Not Found"));

        if(product.getStockQuantity() < quantity) {
            throw new InsufficientStockException("Not enough stock for product " + product.getName());
        }

        User user =  userService.getCurrentLoggedInUser();

        // update the stock quantity and re-save
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);

        // create a transaction
        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.SALE)
                .status(TransactionStatus.COMPLETED)
                .product(product)
                .user(user)
                .totalProducts(quantity)
                .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)))
                .description(transactionRequest.getDescription())
                .build();

        transactionRepository.save(transaction);

        return ApiResponse.<Void>builder()
                .status(200)
                .message("Transaction Sold Successfully")
                .build();
    }

    @Override
    public ApiResponse<Void> returnToSupplier(TransactionRequest transactionRequest) {
        Long productId = transactionRequest.getProductId();
        Long supplierId = transactionRequest.getSupplierId();
        Integer quantity = transactionRequest.getQuantity();

        if(supplierId == null) throw new NameValueRequiredException("Supplier ID is required");

        Product product = productRepository.findById(productId)
                .orElseThrow(()-> new NotFoundException("Product Not Found"));

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(()-> new NotFoundException("Supplier Not Found"));

        User user =  userService.getCurrentLoggedInUser();

        // update the stock quantity and re-save
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);

        // create a transaction
        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.RETURN_SUPPLIER)
                .status(TransactionStatus.PROCESSING)
                .product(product)
                .user(user)
                .supplier(supplier)
                .totalProducts(quantity)
                .totalPrice(BigDecimal.ZERO)
                .description(transactionRequest.getDescription())
                .build();

        transactionRepository.save(transaction);

        return ApiResponse.<Void>builder()
                .status(200)
                .message("Transaction Returned Successfully Initialized")
                .build();
    }

    @Override
    public ApiResponse<List<TransactionDTO>> getAllTransactions(int page, int size, String searchText) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Transaction> transactionPage = transactionRepository.searchTransactions(searchText, pageable);
        List<TransactionDTO> transactionDTOS = modelMapper
                .map(transactionPage.getContent(), new TypeToken<List<TransactionDTO>>() {}.getType());

        transactionDTOS.forEach(transactionDTOItem -> {
            transactionDTOItem.setUser(null);
            transactionDTOItem.setProduct(null);
            transactionDTOItem.setSupplier(null);
        });

        return ApiResponse.<List<TransactionDTO>>builder()
                .status(200)
                .message("Success")
                .data(transactionDTOS)
                .totalPages(transactionPage.getTotalPages())
                .totalElement(transactionPage.getTotalElements())
                .build();
    }

    @Override
    public ApiResponse<TransactionDTO> getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Transaction Not Found"));

        TransactionDTO transactionDTO = modelMapper.map(transaction, TransactionDTO.class);
        // removing user transaction list
        transactionDTO.getUser().setTransactions(null);

        return ApiResponse.<TransactionDTO>builder()
                .status(200)
                .message("Success")
                .data(transactionDTO)
                .build();

    }

    @Override
    public ApiResponse<List<TransactionDTO>> getAllTransactionsByMonthAndYear(int month, int year) {

        List<Transaction> transactions = transactionRepository.findAllByMonthAndYear(month, year);
        List<TransactionDTO> transactionDTOS = modelMapper
                .map(transactions, new TypeToken<List<TransactionDTO>>() {}.getType());

        transactionDTOS.forEach(transactionDTOItem -> {
            transactionDTOItem.setUser(null);
            transactionDTOItem.setProduct(null);
            transactionDTOItem.setSupplier(null);
        });

        return ApiResponse.<List<TransactionDTO>>builder()
                .status(200)
                .message("Success")
                .data(transactionDTOS)
                .build();
    }

    @Override
    public ApiResponse<Void> updateTransactionStatus(Long transactionId, TransactionStatus transactionStatus) {
        Transaction existingTransaction = transactionRepository.findById(transactionId)
                .orElseThrow(()-> new NotFoundException("Transaction Not Found"));

        existingTransaction.setStatus(transactionStatus);
        existingTransaction.setUpdatedAt(LocalDateTime.now());

        transactionRepository.save(existingTransaction);

        return ApiResponse.<Void>builder()
                .status(200)
                .message("Transaction Status Successfully Updated")
                .build();
    }
}
