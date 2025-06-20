package com.javaweb.controller;

import com.javaweb.dtos.request.ChangePasswordRequest;
import com.javaweb.dtos.request.CreateAdminRequest;
import com.javaweb.dtos.request.UserSearchRequest;
import com.javaweb.dtos.request.UserSortRequest;
import com.javaweb.dtos.response.admin.*;
import com.javaweb.entities.User;
import com.javaweb.exceptions.ResourceNotFoundException;
import com.javaweb.services.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@Validated
@CrossOrigin("*")
public class UserController {

    private final String POSITIVE_USERID = "userId must positve number";

    private final UserService userService;
    private final ReportService reportService;
    private final PostService postService;
    private final EnrollmentService enrollmentService;
    private final CommentService commentService;
    private final ScoreService scoreService;
    private final NotificationService notificationService;
    private final RatingService ratingService;
    private final TransactionService transactionService;
    private final CartService cartService;

    @GetMapping("/learners")
    public Page<UserDTO> getAllLearners(@ModelAttribute @Valid UserSearchRequest userSearchRequest, @ModelAttribute @Valid UserSortRequest userSortRequest, Pageable pageable) {
        return userService.getAllUsers(userSearchRequest, userSortRequest, pageable);
    }
    @GetMapping("/search")
    public ResponseEntity<Page<User>> searchUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(userService.searchUsers(keyword, role, isActive, pageable));
    }
    @GetMapping("/admins")
    public Page<UserDTO> getAllAdmins(@ModelAttribute @Valid UserSearchRequest userSearchRequest, @ModelAttribute @Valid UserSortRequest userSortRequest, Pageable pageable) {
        return userService.getAllUsers(userSearchRequest, userSortRequest, pageable);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @GetMapping("/{userId}/reportsMade")
    public Page<ReportDTO> getAllReportsMade(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId, Pageable pageable) {
        return reportService.getAllReportsMade(userId, pageable);
    }

    @GetMapping("/{userId}/reportsReceived")
    public Page<ReportDTO> getAllReportsReceived(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId, Pageable pageable) {
        return reportService.getAllReportsReceived(userId, pageable);
    }

    @GetMapping("/{userId}/posts")
    public Page<PostDTO> getAllPosts(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId, Pageable pageable) {
        return postService.getAllPostsOfUser(userId, pageable);
    }

    @GetMapping("/{userId}/enrollments")
    public Page<EnrollmentDTO> getAllEnrollments(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId, Pageable pageable) {
        return enrollmentService.getAllEnrollments(userId, pageable);
    }

    @GetMapping("/{userId}/comments")
    public Page<CommentDTO> getAllComments(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId, Pageable pageable) {
        return commentService.getAllComments(userId, pageable);
    }

    @GetMapping("/{userId}/scores")
    public Page<ScoreDTO> getAllScores(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId, Pageable pageable) {
        return scoreService.getAllScores(userId, pageable);
    }

    @GetMapping("/{userId}/notifications")
    public Page<NotificationDTO> getAllNotifications(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId, Pageable pageable) {
        return notificationService.getAllNotifications(userId, pageable);
    }

    @GetMapping("/{userId}/ratings")
    public Page<RatingDTO> getAllRatings(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId, Pageable pageable) {
        return ratingService.getAllRatings(userId, pageable);
    }

    @GetMapping("/{userId}/transactions")
    public Page<TransactionDTO> getAllTransactions(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId, Pageable pageable) {
        return transactionService.getAllTransactions(userId, pageable);
    }

    @GetMapping("/{userId}/cart")
    public ResponseEntity<CartDTO> getCart(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PutMapping("/{userId}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId) {
        userService.resetPassword(userId);
        return ResponseEntity.noContent().build();
    }

    // API: POST /api/users/{id}/change-password
    @PostMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable("userId") Long userId,
            @RequestBody ChangePasswordRequest request) {

        try {
            userService.changePassword(userId, request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password changed successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable("userId") @Positive(message = POSITIVE_USERID) Long userId) {
        userService.removeUser(userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping()
    public ResponseEntity<Void> createAdmin(@RequestBody @Valid CreateAdminRequest createAdminRequest) {
        userService.createAdmin(createAdminRequest);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable("id") Long userId,
            @RequestBody UserDTO userDTO) {

        try {
            userService.updateProfile(userId, userDTO);
            return ResponseEntity.ok("User profile updated successfully.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            userService.registerUser(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        userService.forgotPassword(email);
        return ResponseEntity.ok("Reset password link has been sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Password has been reset successfully.");
    }

}
