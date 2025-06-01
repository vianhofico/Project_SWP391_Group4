package com.javaweb.service.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dto.response.admin.UserDTO;
import com.javaweb.dto.request.LoginRequest;
import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.dto.request.UserSortRequest;
import com.javaweb.entity.User;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DTOConverter dtoConverter;

    @Transactional(readOnly = true)
    @Override
    public Page<UserDTO> getAllUsers(UserSearchRequest userSearchRequest, UserSortRequest userSortRequest, Pageable pageable) {
        // trong DB không có trường status, lấy theo trường isActive để truy vấn
        if (userSearchRequest != null && userSearchRequest.getStatus() != null && !userSearchRequest.getStatus().equals("")) {
            userSearchRequest.setIsActive(userSearchRequest.getStatus().equals("Active"));
        }

        Page<User> pageUsers = userRepository.getAllUsers(userSearchRequest, userSortRequest, pageable);

        // Chuyển đổi User sang UserDTO
        return pageUsers.map(dtoConverter::toUserDTO);
    }


    @Transactional
    @Override
    public void setStatus(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setIsActive(!user.getIsActive());
            userRepository.save(user);
        }
    }

    @Transactional
    @Override
    public void updateReportCount(Long userId) {
        Integer reportCount = userRepository.getReportCount(userId);
        if (reportCount != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setReportCount(reportCount);
                userRepository.save(user);
            }
        }
    }

    @Transactional
    @Override
    public void removeUser(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            userRepository.delete(user);
        }
    }

    @Override
    public UserDTO getUser(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        return dtoConverter.toUserDTO(user);
    }

    @Override
    public void loginUser(LoginRequest loginRequest) {

    }
}

