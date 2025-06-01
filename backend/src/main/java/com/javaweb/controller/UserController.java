package com.javaweb.controller;

import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.dto.request.UserSortRequest;
import com.javaweb.dto.response.admin.*;
import com.javaweb.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
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

    @GetMapping
    public Page<UserDTO> getAllUsers(@ModelAttribute UserSearchRequest userSearchRequest, @ModelAttribute UserSortRequest userSortRequest, Pageable pageable) {
        return userService.getAllUsers(userSearchRequest, userSortRequest, pageable);
    }

    @GetMapping("/{userId}")
    public UserDTO getUser(@PathVariable("userId") Long userId) {
        return userService.getUser(userId);
    }

    @GetMapping("/{userId}/reportsMade")
    public Page<ReportDTO> getAllReportsMade(@PathVariable("userId") Long userId, Pageable pageable) {
        return reportService.getAllReportsMade(userId, pageable);
    }

    @GetMapping("/{userId}/reportsReceived")
    public Page<ReportDTO> getAllReportsReceived(@PathVariable("userId") Long userId, Pageable pageable) {
        return reportService.getAllReportsReceived(userId, pageable);
    }

    @GetMapping("/{userId}/posts")
    public Page<PostDTO> getAllPosts(@PathVariable("userId") Long userId, Pageable pageable) {
        return postService.getAllPostsOfUser(userId, pageable);
    }

    @GetMapping("/{userId}/enrollments")
    public Page<EnrollmentDTO> getAllEnrollments(@PathVariable("userId") Long userId, Pageable pageable) {
        return enrollmentService.getAllEnrollments(userId, pageable);
    }

    @GetMapping("/{userId}/comments")
    public Page<CommentDTO> getAllComments(@PathVariable("userId") Long userId, Pageable pageable) {
        return commentService.getAllComments(userId, pageable);
    }

    @GetMapping("/{userId}/scores")
    public Page<ScoreDTO> getAllScores(@PathVariable("userId") Long userId, Pageable pageable) {
        return scoreService.getAllScores(userId, pageable);
    }

    @GetMapping("/{userId}/notifications")
    public Page<NotificationDTO> getAllNotifications(@PathVariable("userId") Long userId, Pageable pageable) {
        return notificationService.getAllNotifications(userId, pageable);
    }

    @GetMapping("/{userId}/ratings")
    public Page<RatingDTO> getAllRatings(@PathVariable("userId") Long userId, Pageable pageable) {
        return ratingService.getAllRatings(userId, pageable);
    }

    @GetMapping("/{userId}/transactions")
    public Page<TransactionDTO> getAllTransactions(@PathVariable("userId") Long userId, Pageable pageable) {
        return transactionService.getAllTransactions(userId, pageable);
    }

    @GetMapping("/{userId}/cart")
    public CartDTO getCart(@PathVariable("userId") Long userId) {
        return cartService.getCart(userId);
    }

    @PutMapping("/{userId}")
    public void setStatus(@PathVariable("userId") Long userId) {
        userService.setStatus(userId);
    }

    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable("userId") Long userId) {
        userService.removeUser(userId);
    }
}
