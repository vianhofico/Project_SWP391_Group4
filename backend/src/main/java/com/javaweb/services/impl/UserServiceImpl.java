package com.javaweb.services.impl;

import com.javaweb.converter.DTOConverter;
import com.javaweb.dtos.request.CreateAdminRequest;
import com.javaweb.dtos.request.UserSearchRequest;
import com.javaweb.dtos.request.UserSortRequest;
import com.javaweb.dtos.response.admin.UserDTO;
import com.javaweb.entities.PasswordResetToken;
import com.javaweb.entities.User;
import com.javaweb.exceptions.EmailExistException;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.repositories.PasswordResetTokenRepository;
import com.javaweb.repositories.UserRepository;
import com.javaweb.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordResetTokenRepository tokenRepository;
    @Autowired
    private final DTOConverter dtoConverter;
    @Autowired
    private EmailService emailService;

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
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot find user with id: " + userId));

        if ( !user.getPassword().equals(oldPassword)) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        user.setPassword((newPassword));
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

    @Override
    public void registerUser(UserDTO userDTO) {
        // Kiểm tra email đã tồn tại chưa


        User user = new User();

        user.setFullName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setPassword((userDTO.getPassword())); // mã hóa
        user.setImageUrl(userDTO.getImageUrl());

        // Parse ngày sinh (nếu có)
        if (userDTO.getBirthDate() != null) {
            try {
                LocalDate birthDate = LocalDate.parse(userDTO.getBirthDate());
                user.setBirthDate(birthDate);
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid birthDate format. Expected yyyy-MM-dd");
            }
        }

        // Các trường mặc định
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());
        user.setIsActive(true);
        user.setReportCount(0);

        userRepository.save(user);
    }

    @Override
    public void updateProfile(Long userId, UserDTO userDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot find user with id: " + userId));

        if (userDTO.getFullName() != null) {
            user.setFullName(userDTO.getFullName());
        }

        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail());
        }

        if (userDTO.getBirthDate() != null) {
            // Giả sử định dạng ngày là yyyy-MM-dd
            try {
                LocalDate birthDate = LocalDate.parse(userDTO.getBirthDate());
                user.setBirthDate(birthDate);
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid birthDate format. Expected yyyy-MM-dd");
            }
        }

        if (userDTO.getImageUrl() != null) {
            user.setImageUrl(userDTO.getImageUrl());
        }

        userRepository.save(user);
    }

    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Email not found: " + email));

        // Tạo token
        String token = UUID.randomUUID().toString();

        // Lưu token
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(resetToken);

        // Gửi email (giả sử có EmailService)
        String resetLink = "http://localhost:8081/api/users/reset-password?token=" + token;
        String subject = "Reset your password";
        String content = "Hi " + user.getFullName() + ",\n\nClick the link below to reset your password:\n" + resetLink;

        emailService.sendEmail(user.getEmail(), subject, content);
    }


    @Override
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token);

        if (resetToken == null || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Invalid or expired token.");
        }

        User user = resetToken.getUser();
        user.setPassword(newPassword);
        userRepository.save(user);

        // Xoá token sau khi dùng
        tokenRepository.delete(resetToken);
    }



}

