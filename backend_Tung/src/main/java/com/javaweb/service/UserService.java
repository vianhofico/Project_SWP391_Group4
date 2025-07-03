package com.javaweb.service;

import com.javaweb.entity.User;
import com.javaweb.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(long id) {
        return this.userRepository.getById(id);
    }

    public User getUserByEmail(String email){
        return this.userRepository.findByEmail(email);
    }


}
