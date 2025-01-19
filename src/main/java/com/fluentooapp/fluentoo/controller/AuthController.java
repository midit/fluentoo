package com.fluentooapp.fluentoo.controller;

import com.fluentooapp.fluentoo.dto.UserDto;
import com.fluentooapp.fluentoo.entity.Subject;
import com.fluentooapp.fluentoo.entity.User;
import com.fluentooapp.fluentoo.repository.SubjectRepository;
import com.fluentooapp.fluentoo.service.UserService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping("/account")
    public Map<String, Object> getAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        if (authentication != null) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userService.findUserByEmail(userDetails.getUsername());
            List<Subject> subjects = subjectRepository.findAll();

            response.put("user", user);
            response.put("subjects", subjects);
        }

        return response;
    }

    @GetMapping("/users")
    public List<UserDto> listUsers() {
        return userService.findAllUsers();
    }
}
