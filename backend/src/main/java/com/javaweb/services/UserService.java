package com.javaweb.services;

import com.javaweb.dtos.request.CreateAdminRequest;
import com.javaweb.dtos.request.UserSearchRequest;
import com.javaweb.dtos.request.UserSortRequest;
import com.javaweb.dtos.response.admin.UserDTO;
import com.javaweb.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserDTO> getAllUsers(UserSearchRequest userSearchRequest, UserSortRequest userSortRequest, Pageable pageable);
    Page<User> searchUsers(String keyword, String role, Boolean isActive, Pageable pageable);

    void updateReportCount(Long userId);

    void removeUser(Long userId);

    UserDTO getUser(Long userId);

    void resetPassword(Long userId);
    void changePassword(Long userId, String oldPassword, String newPassword);
    void createAdmin(CreateAdminRequest createAdminRequest);

    void registerUser(UserDTO userDTO);
    void updateProfile(Long userId, UserDTO userDTO);

    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
}
