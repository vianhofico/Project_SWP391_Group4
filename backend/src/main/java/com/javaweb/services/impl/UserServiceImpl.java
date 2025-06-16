package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.request.CreateAdminRequest;
import com.javaweb.dtos.request.UserSearchRequest;
import com.javaweb.dtos.request.UserSortRequest;
import com.javaweb.dtos.response.admin.UserDTO;
import com.javaweb.entities.User;
import com.javaweb.exceptions.EmailExistException;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.UserRepository;
import com.javaweb.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DTOConverter dtoConverter;

    private final String NEW_PASSWORD = "12345678"; // Placeholder for new password logic

    @Transactional(readOnly = true)
    @Override
    public Page<UserDTO> getAllUsers(UserSearchRequest userSearchRequest, UserSortRequest userSortRequest, Pageable pageable) {
        String fullName = userSearchRequest.getFullName();
        Boolean isActive = userSearchRequest.getIsActive();
        String sortField = userSortRequest.sortField();
        String sortOrder = userSortRequest.sortOrder();
        if (userSearchRequest != null && userSearchRequest.getStatus() != null && !userSearchRequest.getStatus().isEmpty()) {
            isActive = (userSearchRequest.getStatus().toUpperCase().equals("ACTIVE"));
        }

        if (fullName!=null && fullName.isEmpty()) {//xử lý trường hợp mới tạo user chưa có fullName không hiện lên admin
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
        Page<User> pageUsers = userRepository.findAllUsers(fullName, userSearchRequest.getRole().toUpperCase(), isActive, pageable);
        return pageUsers.map(dtoConverter::toUserDTO);
    }

    @Override
    public Page<User> searchUsers(String keyword, String role, Boolean isActive, Pageable pageable) {
        Specification<User> spec = Specification.where(null);

        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.or(
                            cb.like(cb.lower(root.get("fullName")), "%" + keyword.toLowerCase() + "%"),
                            cb.like(cb.lower(root.get("email")), "%" + keyword.toLowerCase() + "%")
                    )
            );
        }

        if (role != null && !role.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("role"), role));
        }

        if (isActive != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isActive"), isActive));
        }

        return userRepository.findAll(spec, pageable);
    }

    @Transactional
    @Override
    public void updateReportCount(Long userId) {
        Integer reportCount = userRepository.getReportCount(userId);
        if (reportCount != null) {
            User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Cannot find user with id: " + userId));
            if (user != null) {
                user.setReportCount(reportCount);
                userRepository.save(user);
            }
        }
    }

    @Transactional
    @Override
    public void removeUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Cannot find user with id: " + userId));
        if (user != null) {
            userRepository.delete(user);
        }
    }

    @Override
    public UserDTO getUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Cannot find user with id: " + userId));
        return dtoConverter.toUserDTO(user);
    }

    @Override
    public void resetPassword(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Cannot find user with id: " + userId + " to reset password"));
        user.setPassword(NEW_PASSWORD);
        userRepository.save(user);
    }

    @Override
    public void createAdmin(CreateAdminRequest createAdminRequest) {
        String email = createAdminRequest.email();
        Optional<User> opUser = userRepository.findByEmail(email);
        if (opUser.isPresent()) {
            throw new EmailExistException("Email: " + createAdminRequest.email() + " already exist");
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

