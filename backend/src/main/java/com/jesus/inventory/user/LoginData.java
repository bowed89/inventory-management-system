package com.jesus.inventory.user;

import com.jesus.inventory.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginData {
    private String token;
    private UserRole role;
    private String expirationTime;
}
