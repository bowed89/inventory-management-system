package com.jesus.inventory.service.impl;

import com.jesus.inventory.dto.TransactionRequest;
import com.jesus.inventory.entity.Product;
import com.jesus.inventory.entity.User;
import com.jesus.inventory.exceptions.InsufficientStockException;
import com.jesus.inventory.exceptions.NotFoundException;
import com.jesus.inventory.repository.ProductRepository;
import com.jesus.inventory.repository.SupplierRepository;
import com.jesus.inventory.repository.TransactionRepository;
import com.jesus.inventory.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceImplTest {

    @Mock
    private TransactionRepository transactionRepository;
    @Mock
    private ModelMapper modelMapper;
    @Mock
    private SupplierRepository supplierRepository;
    @Mock
    private UserService userService;
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    @Test
    void classIsTransactional() {
        assertThat(TransactionServiceImpl.class.isAnnotationPresent(Transactional.class)).isTrue();
    }

    @Test
    void sell_throwsWhenStockIsInsufficient() {
        Product product = Product.builder().id(1L).name("Widget").stockQuantity(3).price(BigDecimal.TEN).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        TransactionRequest request = new TransactionRequest(1L, 5, null, "sale");

        assertThatThrownBy(() -> transactionService.sell(request))
                .isInstanceOf(InsufficientStockException.class);

        verify(productRepository, never()).save(any());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void sell_decrementsStockWhenThereIsEnough() {
        Product product = Product.builder().id(1L).name("Widget").stockQuantity(10).price(BigDecimal.TEN).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(userService.getCurrentLoggedInUser()).thenReturn(User.builder().id(1L).build());

        TransactionRequest request = new TransactionRequest(1L, 4, null, "sale");

        transactionService.sell(request);

        assertThat(product.getStockQuantity()).isEqualTo(6);
        verify(productRepository, times(1)).save(product);
        verify(transactionRepository, times(1)).save(any());
    }

    @Test
    void sell_throwsNotFoundWhenProductMissing() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        TransactionRequest request = new TransactionRequest(1L, 1, null, "sale");

        assertThatThrownBy(() -> transactionService.sell(request))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void restockInventory_incrementsStock() {
        Product product = Product.builder().id(1L).name("Widget").stockQuantity(5).price(BigDecimal.TEN).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(supplierRepository.findById(2L)).thenReturn(Optional.of(com.jesus.inventory.entity.Supplier.builder().id(2L).build()));
        when(userService.getCurrentLoggedInUser()).thenReturn(User.builder().id(1L).build());

        TransactionRequest request = new TransactionRequest(1L, 7, 2L, "restock");

        transactionService.restockInventory(request);

        assertThat(product.getStockQuantity()).isEqualTo(12);
        verify(productRepository, times(1)).save(product);
        verify(transactionRepository, times(1)).save(any());
    }
}
