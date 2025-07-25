package com.javaweb.services.impl;

import com.javaweb.converter.CourseDTOConverter;
import com.javaweb.dtos.request.CourseCreateRequest;
import com.javaweb.dtos.request.CourseUpdateRequest;
import com.javaweb.dtos.request.SearchCourseRequest;
import com.javaweb.dtos.request.SearchRequest;
import com.javaweb.dtos.response.CourseDTO;
import com.javaweb.entities.*;
import com.javaweb.enums.DiscountType;
import com.javaweb.enums.ResourceType;
import com.javaweb.enums.TargetType;
import com.javaweb.exceptions.AppException;
import com.javaweb.exceptions.ErrorCode;
import com.javaweb.repositories.*;
import com.javaweb.services.AttachmentService;
import com.javaweb.services.CourseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private final CourseDTOConverter courseDTOConverter;
    private final CourseRepository courseRepository;
    private final TopicRepository topicRepository;
    private final AttachmentRepository attachmentRepository;
    private final AttachmentService attachmentService;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CartRepository cartRepository;
    private final UserServiceImpl userServiceImpl;
    private final DiscountEventRepository discountEventRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;

    @Override
    public List<CourseDTO> getAllCourseDtos() {
        List<CourseDTO> courseDtos = new ArrayList<>();
        List<Course> courses = courseRepository.findAll();
        for (Course entity : courses) {
            CourseDTO courseDTO = courseDTOConverter.toCourseDTO(entity);
            courseDTO.setRating(getAverageRating(entity));
            courseDtos.add(courseDTO);
        }
        return courseDtos;
    }

    @Override
    public CourseDTO getCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        CourseDTO courseDTO = courseDTOConverter.toCourseDTO(course);
        courseDTO.setRating(getAverageRating(course));
        return courseDTO;
    }

    private void validateUniqueMedia(String imageUrl, String videoTrialUrl, Long currentCourseId, boolean isUpdate) {
        if (imageUrl != null) {
            boolean isImageUsed = isUpdate
                    ? courseRepository.existsByImageUrlAndCourseIdNot(imageUrl, currentCourseId)
                    : courseRepository.existsByImageUrl(imageUrl);
            if (isImageUsed) {
                throw new IllegalArgumentException("The selected image has already been used by another course.");
            }
        }

        if (videoTrialUrl != null) {
            boolean isVideoUsed = isUpdate
                    ? courseRepository.existsByVideoTrialUrlAndCourseIdNot(videoTrialUrl, currentCourseId)
                    : courseRepository.existsByVideoTrialUrl(videoTrialUrl);
            if (isVideoUsed) {
                throw new IllegalArgumentException("The selected trial video has already been used by another course.");
            }
        }
    }

    @Override
    @Transactional
    public Course createCourse(CourseCreateRequest request) {
        Topic topic = topicRepository.findById(request.topicId()).orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_FOUND));
        validateUniqueMedia(request.imageUrl(), request.videoTrialUrl(), null, false);
        Attachment imageAttachment = attachmentService.createImageAttachment(request.imageUrl());
        Attachment videoAttachment = attachmentService.createVideoAttachment(request.videoTrialUrl());
        Course course = new Course();
        List<Topic> topicEntities = new ArrayList<>();
        topicEntities.add(topic);
        course.setTopics(topicEntities);
        course.setTitle(request.title());
        course.setDescription(request.description());
        course.setImageUrl(request.imageUrl());
        course.setVideoTrialUrl(request.videoTrialUrl());
        course.setPrice(request.price());
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdateAt(LocalDateTime.now());
        course.setStatus(false);
        imageAttachment.setCourse(course);
        videoAttachment.setCourse(course);
        List<Attachment> attachmentEntities = new ArrayList<>();
        attachmentEntities.add(imageAttachment);
        attachmentEntities.add(videoAttachment);
        course.setAttachments(attachmentEntities);
        return courseRepository.save(course);
    }

    @Override
    public List<CourseDTO> getCoursesNotInTopic(Topic topic) {
        List<Course> entities = courseRepository.findByTopicsNotContaining(topic);
        List<CourseDTO> courseDtos = new ArrayList<>();
        for (Course entity : entities) {
            CourseDTO courseDTO = courseDTOConverter.toCourseDTO(entity);
            courseDTO.setRating(getAverageRating(entity));
            courseDtos.add(courseDTO);
        }
        return courseDtos;
    }

    @Override
    @Transactional
    public Course updateCourse(CourseUpdateRequest request, Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        validateUniqueMedia(request.imageUrl(), request.videoTrialUrl(), id, true);
        List<Attachment> newAttachments = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        if (request.imageUrl() != null && !Objects.equals(course.getImageUrl(), request.imageUrl())) {
            course.getAttachments().stream()
                    .filter(a -> a.getType() == ResourceType.image && !a.getIsDeleted())
                    .forEach(a -> {
                        a.setIsDeleted(true);
                        a.setDeletedAt(now);
                    });
            Attachment newImageAttachment = attachmentService.createImageAttachment(request.imageUrl());
            newAttachments.add(newImageAttachment);
            course.setImageUrl(request.imageUrl());
        }

        if (request.videoTrialUrl() != null && !Objects.equals(course.getVideoTrialUrl(), request.videoTrialUrl())) {
            course.getAttachments().stream()
                    .filter(a -> a.getType() == ResourceType.video && !a.getIsDeleted())
                    .forEach(a -> {
                        a.setIsDeleted(true);
                        a.setDeletedAt(now);
                    });
            Attachment newVideoAttachment = attachmentService.createVideoAttachment(request.videoTrialUrl());
            newAttachments.add(newVideoAttachment);
            course.setVideoTrialUrl(request.videoTrialUrl());
        }
        if (request.status() != null) {
            course.setStatus(request.status().equalsIgnoreCase("ACTIVE") ? true : false);
        }
        if (request.title() != null) {
            course.setTitle(request.title());
        }

        if (request.description() != null) {
            course.setDescription(request.description());
        }

        if (request.price() != null) {
            course.setPrice(request.price());
        }

        course.setUpdateAt(now);

        if (!newAttachments.isEmpty()) {
            course.getAttachments().addAll(newAttachments);
        }

        return courseRepository.save(course);
    }

    @Override
    public List<CourseDTO> getCoursesInTopic(Long topicId) {
        Topic topic = topicRepository.findById(topicId).orElseThrow(
                () -> new AppException(ErrorCode.TOPIC_NOT_FOUND));
        List<Course> entities = courseRepository.findByTopics(topic);
        List<CourseDTO> courseDtos = new ArrayList<>();
        for (Course entity : entities) {
            double rating = getAverageRating(entity);
            CourseDTO courseDTO = courseDTOConverter.toCourseDTO(entity);
            courseDTO.setRating(rating);
            courseDtos.add(courseDTO);
        }
        return courseDtos;
    }

    public double getAverageRating(Course course) {
        if (course.getRatings() != null && !course.getRatings().isEmpty()) {
            return course.getRatings().stream()
                    .mapToDouble(Rating::getScore)
                    .average()
                    .orElse(0.0);
        }
        return 0.0;
    }

    @Override
    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        if (course.getEnrollments() != null && course.getEnrollments().size() > 0) {
            throw new AppException(ErrorCode.COURSE_HAS_ENROLLMENTS);
        } else {
            courseRepository.delete(course);
        }
    }

    @Override
    public CourseDTO getCourseWithProgress(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        // Kiểm tra user đã đăng ký khóa học chưa
        Optional<Enrollment> optionalEnrollment = enrollmentRepository.findByUser_UserIdAndCourse_CourseId(userId, courseId);
        if (optionalEnrollment.isEmpty()) {
            // Chưa mua → trả về progress = null
            CourseDTO dto = courseDTOConverter.toCourseDTO(course, null);
            dto.setRating(getAverageRating(course));
            return dto;
        }

        // Đã mua → tính progress
        List<Lesson> lessons = lessonRepository.findByChapter_Course_CourseIdAndStatusTrue(courseId);
        List<Long> lessonIds = lessons.stream().map(Lesson::getLessonId).toList();

        if (lessonIds.isEmpty()) {
            return courseDTOConverter.toCourseDTO(course, 0f); // Không có bài học => progress = 0
        }

        List<LessonProgress> completed = lessonProgressRepository.findCompletedByUserAndLessonIds(userId, lessonIds);

        int total = lessonIds.size();
        int done = completed.size();
        float progress = ((float) done / total) * 100f;

        // Cập nhật vào Enrollment
        Enrollment enrollment = optionalEnrollment.get();
        enrollment.setProgress(progress);
        enrollmentRepository.save(enrollment);

        CourseDTO courseDTO = courseDTOConverter.toCourseDTO(course, progress);
        courseDTO.setRating(getAverageRating(course));
        return courseDTO;
    }

    @Override
    public List<Course> getAllCourses() {
        return this.courseRepository.findAll();
    }

    @Override
    public Cart fetchByUser(User user) {
        return this.cartRepository.findByUser(user);
    }
    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            String email = null;

            if (principal instanceof UserDetails) {
                email = ((UserDetails) principal).getUsername();
            } else if (principal instanceof String) {
                email = (String) principal;
            }

            if (email != null) {
                return userServiceImpl.getUserByEmail(email).get();
            }
        }
        return null;
    }

    @Override
    public void handleAddCourseToCart(long courseId) {
            User user = getCurrentAuthenticatedUser();
            if (user != null) {
                Cart cart = this.cartRepository.findByUser(user);
                if (cart == null) {
                    cart = new Cart();
                    cart.setUser(user);
                    cart.setSum(0);
                    cart = this.cartRepository.save(cart);
                }

                Optional<Course> courseOptional = this.courseRepository.findById(courseId);
                if (courseOptional.isPresent()) {
                    Course course = courseOptional.get();
                    double originalPrice = course.getPrice();
                    double finalPrice = originalPrice;

                    LocalDate today = LocalDate.now();
                    List<DiscountEvent> activeEvents = this.discountEventRepository
                            .findByCourse_CourseIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(courseId, today, today);

                    DiscountEvent activeDiscount = activeEvents.isEmpty() ? null : activeEvents.get(0);
                    if (activeDiscount != null) {
                        if (activeDiscount.getDiscountType() == DiscountType.PERCENT) {
                            finalPrice = originalPrice * (1 - activeDiscount.getDiscountValue() / 100.0);
                        } else {
                            finalPrice = Math.max(originalPrice - activeDiscount.getDiscountValue(), 0);
                        }
                    }

                    CartItem existingItem = this.cartItemRepository.findByCartAndCourse(cart, course);
                    if (existingItem == null) {
                        CartItem newItem = new CartItem();
                        newItem.setCart(cart);
                        newItem.setCourse(course);
                        newItem.setPrice(finalPrice);
                        this.cartItemRepository.save(newItem);

                        cart.setSum(cart.getSum() + 1);
                        this.cartRepository.save(cart);
                    } else {
                        existingItem.setPrice(finalPrice);
                        this.cartItemRepository.save(existingItem);
                    }
                }
            }

    }
    @Transactional
    @Override
    public void handleRemoveCartItem(long id) {
        Optional<CartItem> cartItemOptional = this.cartItemRepository.findById(id);
        if (cartItemOptional.isPresent()) {
            User user = getCurrentAuthenticatedUser();
            if (user == null) return;

            Cart cart = this.cartRepository.findByUser(user);
            this.cartItemRepository.deleteById(id);

            int cartSum = cart.getSum();
            if (cartSum > 1) {
                cart.setSum(cartSum - 1);
                this.cartRepository.save(cart);
            } else {
                cartRepository.deleteCartItemsByCartId(cart.getId());
            }
        }
    }
    private double applyDiscount(double originalPrice, DiscountEvent event) {
        double value = event.getDiscountValue();
        if (event.getDiscountType() == DiscountType.PERCENT) {
            return Math.max(originalPrice * (1 - value / 100.0), 0);
        } else if (event.getDiscountType() == DiscountType.AMOUNT) {
            return Math.max(originalPrice - value, 0);
        }
        return originalPrice;
    }


    public double calculateDiscountedPrice(Course course) {
        double originalPrice = course.getPrice();
        LocalDate today = LocalDate.now();

        // 1. Ưu tiên sự kiện giảm giá riêng cho khóa học
        List<DiscountEvent> courseEvents = discountEventRepository
                .findByCourse_CourseIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        course.getCourseId(), today, today
                );

        for (DiscountEvent event : courseEvents) {
            if (event.getTargetType() == TargetType.PRODUCT) {
                return applyDiscount(originalPrice, event);
            }
        }

        // 2. Nếu không có sự kiện riêng => tìm sự kiện targetType = ALL
        List<DiscountEvent> globalEvents = discountEventRepository
                .findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today);

        for (DiscountEvent event : globalEvents) {
            if (event.getTargetType() == TargetType.ALL) {
                return applyDiscount(originalPrice, event);
            }
        }

        // 3. Không có sự kiện giảm giá
        return originalPrice;
    }
    @Transactional
    @Override
    public void handlePlaceOrder(List<Long> cartItemIds) {
        User user = getCurrentAuthenticatedUser(); // bạn đã có sẵn hàm này rồi
        if (user == null) return;

        Cart cart = cartRepository.findByUser(user);
        if (cart == null) return;

        List<CartItem> cartItems = new ArrayList<>();
        for (long cartItemId : cartItemIds) {
            cartItemRepository.findById(cartItemId).ifPresent(cartItems::add);
        }

        if (cartItems.isEmpty()) return;

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());

        double totalPrice = 0;

        for (CartItem cartItem : cartItems) {
            Course course = cartItem.getCourse();
//            double originalPrice = course.getPrice();
            double finalPrice = calculateDiscountedPrice(course);

            totalPrice += finalPrice;

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setCourse(course);
            orderItem.setPrice(finalPrice); // đã có giảm giá
            order.getOrderItems().add(orderItem);
        }

        order.setTotalPrice(totalPrice);
        List<Enrollment> enrollments = new ArrayList<>();
        for(OrderItem orderItem : order.getOrderItems()) {
            Enrollment enrollment = new Enrollment();
            enrollment.setUser(user);
            enrollment.setCourse(orderItem.getCourse());
            enrollment.setProgress((float)0);
            enrollments.add(enrollment);
            this.enrollmentRepository.save(enrollment);
        }


        orderRepository.save(order);

        // Xoá các CartItem sau khi đặt hàng
        for (CartItem cartItem : cartItems) {
            cartItemRepository.deleteById(cartItem.getId());
            cart.setSum(cart.getSum() - 1);
        }

        if (cart.getSum() <= 0) {
            cartRepository.deleteCartItemsByCartId(cart.getId());
        }
    }


    public Page<CourseDTO> filterAndSortCourses(SearchCourseRequest request) {
        Pageable pageable = PageRequest.of(
                request.page(),
                request.size(),
                Sort.by(Sort.Direction.fromString(request.order()),
                        Optional.ofNullable(request.field()).orElse("id"))
        );

        Page<Course> courses = courseRepository.findByFilter(
                request.topicId() != 0 ? request.topicId() : null,
                request.search(),
                request.status(),
                pageable
        );

        return courses.map(course -> {
            CourseDTO dto = courseDTOConverter.toCourseDTO(course);
            dto.setRating(getAverageRating(course));
            return dto;
        });
    }

    @Override
    public Page<CourseDTO> filterAndSort(List<CourseDTO> courses, SearchRequest request) {
        for (CourseDTO dto : courses) {
            if (dto.getRating() == null && dto.getCourseId() != null) {
                Course course = courseRepository.findById(dto.getCourseId())
                        .orElse(null);
                if (course != null) {
                    dto.setRating(getAverageRating(course));
                } else {
                    dto.setRating(0.0); // fallback nếu không tìm thấy
                }
            }
        }

        Stream<CourseDTO> stream = courses.stream();

        if (request.status() != null && !request.status().isEmpty()) {
            stream = stream.filter(course ->
                    request.status().equalsIgnoreCase(course.getStatus())
            );
        }

        if (request.search() != null && !request.search().isEmpty()) {
            String keyword = request.search().toLowerCase();
            stream = stream.filter(course ->
                    course.getTitle().toLowerCase().contains(keyword) ||
                            course.getDescription().toLowerCase().contains(keyword)
            );
        }

        Comparator<CourseDTO> comparator;
        String sortField = Optional.ofNullable(request.field()).orElse("title");
        switch (sortField) {
            case "price":
                comparator = Comparator.comparing(CourseDTO::getPrice, Comparator.nullsLast(Long::compareTo));
                break;
            case "rating":
                comparator = Comparator.comparing(CourseDTO::getRating, Comparator.nullsLast(Double::compareTo));
                break;
            case "updateAt":
                comparator = Comparator.comparing(CourseDTO::getUpdateAt, Comparator.nullsLast(LocalDateTime::compareTo));
                break;
            case "popular":
                comparator = Comparator.comparing(course ->
                        course.getAttachmentIds() != null ? course.getAttachmentIds().size() : 0
                );
                break;
            default:
                comparator = Comparator.comparing(CourseDTO::getTitle, Comparator.nullsLast(String::compareToIgnoreCase));
                break;
        }

        if ("desc".equalsIgnoreCase(request.order())) {
            comparator = comparator.reversed();
        }

        List<CourseDTO> sortedList = stream.sorted(comparator).toList();
        int start = request.page() * request.size();
        int end = Math.min(start + request.size(), sortedList.size());
        List<CourseDTO> pagedList = (start >= sortedList.size()) ? Collections.emptyList() : sortedList.subList(start, end);
        return new PageImpl<>(pagedList, PageRequest.of(request.page(), request.size()), sortedList.size());
    }

}


