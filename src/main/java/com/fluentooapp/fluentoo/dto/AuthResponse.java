package com.fluentooapp.fluentoo.dto;

import com.fluentooapp.fluentoo.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserDto user;

    public static AuthResponse fromUser(String token, User user) {
        UserDto userDto = new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail());
        return new AuthResponse(token, userDto);
    }
}