package com.jesus.inventory.service;

import com.jesus.inventory.dto.LoginRequest;
import com.jesus.inventory.dto.RegisterRequest;
import com.jesus.inventory.dto.Response;
import com.jesus.inventory.dto.UserDTO;
import com.jesus.inventory.entity.User;

public interface UserService {
    Response registerUser(RegisterRequest registerRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    User getCurrentLoggedInUser();
    Response updateUser(Long id, UserDTO userDTO);
    Response deleteUser(Long id);
    Response getUserTransactions(Long id);

}
