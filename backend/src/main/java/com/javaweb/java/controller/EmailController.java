package com.javaweb.java.controller;

import com.javaweb.java.entities.Order;
import com.javaweb.java.entities.User;
import com.javaweb.java.repositories.OrderRepository;
import com.javaweb.java.services.impl.UserServiceImpl;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

@RestController
@RequestMapping("")
public class EmailController {

    private final OrderRepository orderRepository;
    private final JavaMailSender mailSender;
    private final UserServiceImpl userServiceImpl;

    public EmailController(OrderRepository orderRepository, JavaMailSender mailSender, UserServiceImpl userServiceImpl) {
        this.orderRepository = orderRepository;
        this.mailSender = mailSender;
        this.userServiceImpl = userServiceImpl;
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

    @GetMapping("/send-email")
    public String sendEmail() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom("he182488toquoctung@gmail.com");
//            message.setTo(user.getEmail());
            message.setSubject("Simple test email from tungtq");
            message.setText("This is a sample email body for my first email");

            mailSender.send(message);
            return "success";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    @GetMapping("/send-email-with-attachment")
    public String sendEmailWithAttachment() {
        try {

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("he182488toquoctung@gmail.com");
            helper.setTo("toqupctung14102004@gmail.com");
            helper.setSubject("Simple test email from tungtq");
            helper.setText("Please find the attached documents below");

            helper.addAttachment("logo.png", new File("C:\\Users\\toqup\\OneDrive\\Pictures\\Screenshots\\Screenshot 2025-06-12 211628.png"));
//            helper.addAttachment("09-03.-Thuc-hanh-tao-users-ao-trong-bo-nho-1.pptx", new File("\"C:\\Users\\toqup\\Downloads\\09-03.-Thuc-hanh-tao-users-ao-trong-bo-nho-1.pptx"));

            mailSender.send(message);
            return "success";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

//    @GetMapping("/send-html-email")
//    public String sendHtmlEmail() {
//        try {
//            User user = getCurrentAuthenticatedUser();
//
//            MimeMessage message = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true);
//
////            helper.setFrom("vianhofico@gmail.com");
//            helper.setFrom("he182488toquoctung@gmail.com");
//
//            helper.setTo(user.getEmail());
//            helper.setSubject("Simple test email from tungtq");
//            try (var inputStream = Objects.requireNonNull(EmailController.class.getResourceAsStream("/templates/email-content.html"))) {
//                helper.setText(
//                        new String(inputStream.readAllBytes(), StandardCharsets.UTF_8),
//                        true
//                );
//            }
//            helper.addInline("logo.png",  new File("C:\\Users\\toqup\\OneDrive\\Pictures\\Screenshots\\Screenshot 2025-06-12 211628.png"));
//
//            mailSender.send(message);
//            return "success";
//        } catch (Exception e) {
//            return e.getMessage();
//        }
//    }

    @GetMapping("/send-html-email")
    public String sendHtmlEmail() {
        try {
            User user = getCurrentAuthenticatedUser();

            // Giả sử bạn lấy đơn hàng mới nhất của user
            Order latestOrder = orderRepository.findTopByUserOrderByCreatedAtDesc(user);
            if (latestOrder == null) {
                return "Không tìm thấy đơn hàng";
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("he182488toquoctung@gmail.com");
            helper.setTo(user.getEmail());
            helper.setSubject("Xác nhận đơn hàng thành công");

            try (var inputStream = Objects.requireNonNull(EmailController.class.getResourceAsStream("/templates/email-content.html"))) {
                String html = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

                // Replace các placeholder bằng dữ liệu thực tế
                String content = html
                        .replace("{{TOTAL_PRICE}}", String.format("%.0f", latestOrder.getTotalPrice()))
                        .replace("{{CREATED_AT}}", latestOrder.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));

                helper.setText(content, true);
            }

            helper.addInline("logo.png", new File("C:\\Users\\toqup\\OneDrive\\Pictures\\Screenshots\\Screenshot 2025-06-12 211628.png"));

            mailSender.send(message);
            return "success";
        } catch (Exception e) {
            return e.getMessage();
        }
    }
}
