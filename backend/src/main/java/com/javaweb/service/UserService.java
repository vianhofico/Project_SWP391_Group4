package com.javaweb.service;

import com.javaweb.dto.UserDTO;
import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.dto.request.UserSortRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    public Page<UserDTO> getAllUsers(UserSearchRequest userSearchRequest, UserSortRequest userSortRequest, Pageable pageable);

    public void setStatus(Long userId);

    public void updateReportCount(Long userId);

    public void removeUser(Long userId);
}
