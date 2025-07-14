package dev.likeech.java.service;

import dev.likeech.java.model.dto.UserDTO;
import dev.likeech.java.model.request.CreateAdminRequest;
import dev.likeech.java.model.request.ResetPasswordRequest;
import dev.likeech.java.model.request.SearchUserRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserDTO> getAllUsers(SearchUserRequest searchUserRequest, Pageable pageable);

    void updateReportCount(Long userId);

    void removeUser(Long userId);

    UserDTO getUser(Long userId);

    void createAdmin(CreateAdminRequest createAdminRequest);

    String saveNewPassword(ResetPasswordRequest resetPasswordRequest);
}
