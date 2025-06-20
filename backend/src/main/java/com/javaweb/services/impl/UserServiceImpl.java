package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.request.CreateAdminRequest;
import com.javaweb.dtos.request.SearchUserRequest;
import com.javaweb.dtos.response.UserDTO;
import com.javaweb.entities.User;
import com.javaweb.exceptions.ResourceAlreadyExistsException;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.UserRepository;
import com.javaweb.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DTOConverter dtoConverter;

    private final String USER_NOTFOUND = "Cannot find user with id: ";

    @Transactional(readOnly = true)
    @Override
    public Page<UserDTO> getAllUsers(SearchUserRequest searchUserRequest, Pageable pageable) {
        String fullName = searchUserRequest.fullName();
        String sortField = searchUserRequest.sortField();
        String sortOrder = searchUserRequest.sortOrder();
        Boolean isActive = null;
        if (searchUserRequest.status() != null && !searchUserRequest.status().isBlank()) {
            isActive = (searchUserRequest.status().equalsIgnoreCase("ACTIVE"));
        }

        if (fullName != null && fullName.isBlank()) {//xử lý trường hợp mới tạo user chưa có fullName không hiện lên admin (khi đó tên user đó là null mà lại tìm kiếm theo %% nên không ra)
            fullName = null;
        }

        if (sortOrder == null || sortField == null || sortField.isEmpty() || sortOrder.isEmpty()) {
            sortOrder = "ASC";
            sortField = "userId";
        }
        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, sortField)
        );
        Page<User> pageUsers = userRepository.findAllUsers(fullName, searchUserRequest.role().toUpperCase(), isActive, pageable);
        return pageUsers.map(dtoConverter::toUserDTO);
    }

    @Transactional
    @Override
    public void updateReportCount(Long userId) {
        Integer reportCount = userRepository.getReportCount(userId);
        if (reportCount != null) {
            User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(USER_NOTFOUND + userId));
            if (user != null) {
                user.setReportCount(reportCount);
                userRepository.save(user);
            }
        }
    }

    @Transactional
    @Override
    public void removeUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(USER_NOTFOUND + userId));
        if (user != null) {
            userRepository.delete(user);
        }
    }

    @Override
    public UserDTO getUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(USER_NOTFOUND + userId));
        return dtoConverter.toUserDTO(user);
    }

    @Override
    public void createAdmin(CreateAdminRequest createAdminRequest) {
        String email = createAdminRequest.email();
        Optional<User> opUser = userRepository.findByEmail(email);
        if (opUser.isPresent()) {
            throw new ResourceAlreadyExistsException("Email: " + createAdminRequest.email() + " already exist");
        }
        User user = User.builder().email(email)
                .password(createAdminRequest.password())
                .createdAt(LocalDateTime.now())
                .role("ADMIN")
                .isActive(true)
                .reportCount(0)
                .build();
        userRepository.save(user);
    }

}

