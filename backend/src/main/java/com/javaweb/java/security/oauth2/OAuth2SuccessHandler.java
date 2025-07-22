package com.javaweb.java.security.oauth2;

import com.javaweb.java.entities.User;
import com.javaweb.java.security.jwt.JwtUtils;
import com.javaweb.java.security.user.CustomOAuth2User;
import com.javaweb.java.exceptions.ResourceNotFoundException;
import com.javaweb.java.repositories.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found in DATABASE"));

        String token = jwtUtils.generateToken(email);

        response.sendRedirect("/oauth2/success?token=" + token);
    }
}
