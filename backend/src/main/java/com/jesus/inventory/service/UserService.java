package com.jesus.inventory.service;

import com.jesus.inventory.dto.ApiResponse;
import com.jesus.inventory.dto.LoginData;
import com.jesus.inventory.dto.LoginRequest;
import com.jesus.inventory.dto.RegisterRequest;
import com.jesus.inventory.dto.UserDTO;
import com.jesus.inventory.entity.User;

import java.util.List;

public interface UserService {
    ApiResponse<Void> registerUser(RegisterRequest registerRequest);
    ApiResponse<LoginData> loginUser(LoginRequest loginRequest);
    ApiResponse<List<UserDTO>> getAllUsers();
    User getCurrentLoggedInUser();
    ApiResponse<Void> updateUser(Long id, UserDTO userDTO);
    ApiResponse<Void> deleteUser(Long id);
    ApiResponse<UserDTO> getUserTransactions(Long id);

}
