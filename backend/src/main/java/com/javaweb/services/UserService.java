package com.javaweb.services;

import com.javaweb.dtos.request.ChangePasswordRequest;
import com.javaweb.dtos.request.CreateAdminRequest;
import com.javaweb.dtos.request.ResetPasswordRequest;
import com.javaweb.dtos.request.SearchUserRequest;
import com.javaweb.dtos.response.UserDTO;
import com.javaweb.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface UserService {

    Page<UserDTO> getAllUsers(SearchUserRequest searchUserRequest, Pageable pageable);

    void updateReportCount(Long userId);

    void removeUser(Long userId);

    UserDTO getUser(Long userId);

    void createAdmin(String email);

    String saveNewPassword(ResetPasswordRequest resetPasswordRequest);

    Optional<User> getUserByEmail(String email);

    void changePassword(ChangePasswordRequest changePasswordRequest);
}
