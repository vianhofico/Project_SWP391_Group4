package com.javaweb.java.services;

import com.javaweb.java.entities.User;
import com.javaweb.java.dtos.response.UserDTO;
import com.javaweb.java.dtos.request.CreateAdminRequest;
import com.javaweb.java.dtos.request.ResetPasswordRequest;
import com.javaweb.java.dtos.request.SearchUserRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface UserService {

    Page<UserDTO> getAllUsers(SearchUserRequest searchUserRequest, Pageable pageable);

    void updateReportCount(Long userId);

    void removeUser(Long userId);

    UserDTO getUser(Long userId);

    void createAdmin(CreateAdminRequest createAdminRequest);

    String saveNewPassword(ResetPasswordRequest resetPasswordRequest);

    Optional<User> getUserByEmail(String email);
}
