package com.javaweb.controller.client;

import com.javaweb.entities.User;
import com.javaweb.services.impl.UserServiceImpl;
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
import java.util.Objects;

@RestController
@RequestMapping("/api")
public class EmailController {


    private final JavaMailSender mailSender;
    private final UserServiceImpl userServiceImpl;

    public EmailController(JavaMailSender mailSender, UserServiceImpl userServiceImpl) {
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
                return userServiceImpl.getUserByEmail(email);
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

    @GetMapping("/send-html-email")
    public String sendHtmlEmail() {
        try {
            User user = getCurrentAuthenticatedUser();

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("he182488toquoctung@gmail.com");
//            helper.setTo("q314e25r@gmail.com");
            helper.setTo(user.getEmail());
            helper.setSubject("Simple test email from tungtq");
            try (var inputStream = Objects.requireNonNull(EmailController.class.getResourceAsStream("/templates/email-content.html"))) {
                helper.setText(
                        new String(inputStream.readAllBytes(), StandardCharsets.UTF_8),
                        true
                );
            }
            helper.addInline("logo.png",  new File("C:\\Users\\toqup\\OneDrive\\Pictures\\Screenshots\\Screenshot 2025-06-12 211628.png"));
//            mailSender.send(message);
//            helper.addAttachment("logo.png", new File("C:\\Users\\toqup\\OneDrive\\Pictures\\Screenshots\\Screenshot 2025-06-12 211628.png"));
//            helper.addAttachment("09-03.-Thuc-hanh-tao-users-ao-trong-bo-nho-1.pptx", new File("\"C:\\Users\\toqup\\Downloads\\09-03.-Thuc-hanh-tao-users-ao-trong-bo-nho-1.pptx"));

            mailSender.send(message);
            return "success";
        } catch (Exception e) {
            return e.getMessage();
        }
    }
}
