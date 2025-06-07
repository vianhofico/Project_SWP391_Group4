package com.javaweb.services;

import com.javaweb.dtos.request.CreateAdminRequest;
import com.javaweb.dtos.request.UserSearchRequest;
import com.javaweb.dtos.request.UserSortRequest;
import com.javaweb.dtos.response.admin.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserDTO> getAllUsers(UserSearchRequest userSearchRequest, UserSortRequest userSortRequest, Pageable pageable);

    void updateReportCount(Long userId);

    void removeUser(Long userId);

    UserDTO getUser(Long userId);

    void resetPassword(Long userId);

    void createAdmin(CreateAdminRequest createAdminRequest);
}
