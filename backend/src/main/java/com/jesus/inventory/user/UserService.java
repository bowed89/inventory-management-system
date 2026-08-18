package com.jesus.inventory.user;

import com.jesus.inventory.common.ApiResponse;
import com.jesus.inventory.user.LoginData;
import com.jesus.inventory.user.LoginRequest;
import com.jesus.inventory.user.RegisterRequest;
import com.jesus.inventory.user.UserDTO;
import com.jesus.inventory.user.User;

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
