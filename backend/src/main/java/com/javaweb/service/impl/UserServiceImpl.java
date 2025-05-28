package com.javaweb.service.impl;

import com.javaweb.converter.UserDTOConverter;
import com.javaweb.dto.UserDTO;
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
    private final UserDTOConverter userDTOConverter;

    @Transactional(readOnly = true)
    @Override
    public Page<UserDTO> getAllUsers(UserSearchRequest userSearchRequest, UserSortRequest userSortRequest, Pageable pageable) {
        // Xử lý filter trạng thái như hiện tại
        if (userSearchRequest != null && userSearchRequest.getStatus() != null && !userSearchRequest.getStatus().equals("")) {
            if (userSearchRequest.getStatus().equals("Active")) {
                userSearchRequest.setIsActive(true);
            } else {
                userSearchRequest.setIsActive(false);
            }
        }

        Page<User> pageUser = userRepository.getAllUsers(userSearchRequest, userSortRequest, pageable);

        // Chuyển đổi User sang UserDTO
        Page<UserDTO> pageUserDTOs = pageUser.map(user -> userDTOConverter.toUserDTO(user));

        return pageUserDTOs;
    }


    @Override
    public void setStatus(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setIsActive(!user.getIsActive());
            userRepository.save(user);
        }
    }

    @Override
    public void updateReportCount(Long userId) {
        Integer reportCount = userRepository.getReportCount(userId);
        System.out.println("aaa");
        if (reportCount != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setReportCount(reportCount);
                userRepository.save(user);
            }
        }
    }

}
