package com.javaweb.controller;

import com.javaweb.dtos.request.CreateAdminRequest;
import com.javaweb.dtos.request.SearchUserRequest;
import com.javaweb.dtos.response.*;
import com.javaweb.services.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@Validated
public class UserController {

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

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/learners")
    public Page<UserDTO> getAllLearners(@ModelAttribute @Valid SearchUserRequest searchUserRequest, Pageable pageable) {
        return userService.getAllUsers(searchUserRequest, pageable);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admins")
    public Page<UserDTO> getAllAdmins(@ModelAttribute @Valid SearchUserRequest searchUserRequest, Pageable pageable) {
        return userService.getAllUsers(searchUserRequest, pageable);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @GetMapping("/{userId}/reportsMade")
    public Page<ReportDTO> getAllReportsMade(@PathVariable("userId") Long userId, Pageable pageable) {
        return reportService.getAllReportsMade(userId, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @GetMapping("/{userId}/reportsReceived")
    public Page<ReportDTO> getAllReportsReceived(@PathVariable("userId") Long userId, Pageable pageable) {
        return reportService.getAllReportsReceived(userId, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @GetMapping("/{userId}/posts")
    public Page<PostDTO> getAllPosts(@PathVariable("userId") Long userId, Pageable pageable) {
        return postService.getAllPostsOfUser(userId, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @GetMapping("/{userId}/enrollments")
    public Page<EnrollmentDTO> getAllEnrollments(@PathVariable("userId") Long userId, Pageable pageable) {
        return enrollmentService.getAllEnrollments(userId, pageable);
    }

    @GetMapping("/{userId}/comments")
    public Page<CommentDTO> getAllComments(@PathVariable("userId") Long userId, Pageable pageable) {
        return commentService.getAllComments(userId, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @GetMapping("/{userId}/scores")
    public Page<ScoreDTO> getAllScores(@PathVariable("userId") Long userId, Pageable pageable) {
        return scoreService.getAllScores(userId, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @GetMapping("/{userId}/notifications")
    public Page<NotificationDTO> getAllNotifications(@PathVariable("userId") Long userId, Pageable pageable) {
        return notificationService.getAllNotifications(userId, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @GetMapping("/{userId}/ratings")
    public Page<RatingDTO> getAllRatings(@PathVariable("userId") Long userId, Pageable pageable) {
        return ratingService.getAllRatings(userId, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @GetMapping("/{userId}/transactions")
    public Page<TransactionDTO> getAllTransactions(@PathVariable("userId") Long userId, Pageable pageable) {
        return transactionService.getAllTransactions(userId, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    @GetMapping("/{userId}/cart")
    public ResponseEntity<CartDTO> getCart(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable("userId") Long userId) {
        userService.removeUser(userId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping()
    public ResponseEntity<Void> createAdmin(@RequestBody @Valid CreateAdminRequest createAdminRequest) {
        userService.createAdmin(createAdminRequest);
        return ResponseEntity.noContent().build();
    }
}
