package com.javaweb.services;

import com.javaweb.dtos.request.CreateAdminRequest;
import com.javaweb.dtos.request.SearchUserRequest;
import com.javaweb.dtos.response.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserDTO> getAllUsers(SearchUserRequest searchUserRequest, Pageable pageable);

    void updateReportCount(Long userId);

    void removeUser(Long userId);

    UserDTO getUser(Long userId);

    void createAdmin(CreateAdminRequest createAdminRequest);
}
