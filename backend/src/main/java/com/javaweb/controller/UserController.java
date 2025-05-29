package com.javaweb.controller;

import com.javaweb.dto.UserDTO;
import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.dto.request.UserSortRequest;
import com.javaweb.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public Page<UserDTO> getAllUsers(@ModelAttribute UserSearchRequest userSearchRequest, @ModelAttribute UserSortRequest userSortRequest, Pageable pageable) {
        return userService.getAllUsers(userSearchRequest, userSortRequest, pageable);
    }

    @PutMapping("/{userId}")
    public void setStatus(@PathVariable("userId") Long userId) {
        userService.setStatus(userId);
    }

    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable("userId") Long userId) {
        userService.removeUser(userId);
    }
}
