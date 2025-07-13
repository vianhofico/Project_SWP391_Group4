package com.javaweb.controller;


import com.javaweb.dtos.request.LoginRequest;
import com.javaweb.dtos.response.admin.UserDTO;
import com.javaweb.entities.Course;
import com.javaweb.entities.User;
import com.javaweb.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (user != null && Boolean.TRUE.equals(user.getIsActive())) {
            UserDTO userDTO = convertToDTO(user);
            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    private UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(user.getUserId());
        userDTO.setFullName(user.getFullName());
        userDTO.setEmail(user.getEmail());
        userDTO.setBirthDate(user.getBirthDate().toString());
        userDTO.setPassword(user.getPassword());
        userDTO.setRole(user.getRole());
        userDTO.setImageUrl(user.getImageUrl());
        return userDTO;
    }

}
