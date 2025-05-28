package com.javaweb.repository.custom;

import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.dto.request.UserSortRequest;
import com.javaweb.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserRepositoryCustom {

    public Page<User> getAllUsers (UserSearchRequest userSearchRequest, UserSortRequest userSortRequest, Pageable pageable);

    public Integer getReportCount(Long userId);
}
