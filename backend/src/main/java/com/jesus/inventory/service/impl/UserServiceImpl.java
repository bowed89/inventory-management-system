package com.jesus.inventory.service.impl;

import com.jesus.inventory.dto.LoginRequest;
import com.jesus.inventory.dto.RegisterRequest;
import com.jesus.inventory.dto.Response;
import com.jesus.inventory.dto.UserDTO;
import com.jesus.inventory.entity.User;
import com.jesus.inventory.enums.UserRole;
import com.jesus.inventory.exceptions.InvalidCredentialsException;
import com.jesus.inventory.exceptions.NotFoundException;
import com.jesus.inventory.repository.UserRepository;
import com.jesus.inventory.security.JwtUtils;
import com.jesus.inventory.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    public final UserRepository userRepository;
    public final PasswordEncoder passwordEncoder;
    public final ModelMapper modelMapper;
    public final JwtUtils jwtUtils;

    @Override
    public Response registerUser(RegisterRequest registerRequest) {
        UserRole role = UserRole.MANAGER;

        if(registerRequest.getRole() != null) {
            role = registerRequest.getRole();
        }

        User userToSave = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .role(role)
                .build();

        userRepository.save(userToSave);

        return Response.builder()
                .status(200)
                .message("User created successfully")
                .build();

    }

    @Override
    public Response loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new NotFoundException("Email not Found"));

        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Password does not match");
        }

        String token = jwtUtils.generateToken(user.getEmail());

        return Response.builder()
                .status(200)
                .message("User logged in successfully")
                .role(user.getRole())
                .token(token)
                .expirationTime("12 weeks")
                .build();
    }

    @Override
    public Response getAllUsers() {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<UserDTO> userDTOS = modelMapper.map(users, new TypeToken<List<UserDTO>>() {}.getType());
        userDTOS.forEach(userDTO -> userDTO.setTransactions(null));

        return Response.builder()
                .status(200)
                .message("Success")
                .users(userDTOS)
                .build();
    }

    @Override
    public User getCurrentLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User Not Found"));

        user.setTransactions(null);

        return user;

    }

    @Override
    public Response updateUser(Long id, UserDTO userDTO) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Not Found"));

        if(userDTO.getEmail() != null) existingUser.setEmail(userDTO.getEmail());
        if(userDTO.getName() != null) existingUser.setName(userDTO.getName());
        if(userDTO.getPhoneNumber() != null) existingUser.setPhoneNumber(userDTO.getPhoneNumber());
        if(userDTO.getRole() != null) existingUser.setRole(userDTO.getRole());

        if(userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        userRepository.save(existingUser);

        return Response.builder()
                .status(200)
                .message("User Updated Successfully")
                .build();
    }

    @Override
    public Response deleteUser(Long id) {

        userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Not Found"));

        userRepository.deleteById(id);

        return Response.builder()
                .status(200)
                .message("User Deleted Successfully")
                .build();

    }

    @Override
    public Response getUserTransactions(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Not Found"));

        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        userDTO.getTransactions().forEach(transactionDTO -> {
            transactionDTO.setUser(null);
            transactionDTO.setSupplier(null);
        });

        return Response.builder()
                .status(200)
                .message("Success")
                .user(userDTO)
                .build();

    }
}
