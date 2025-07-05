package com.javaweb.services.impl;

import com.javaweb.entities.User;
import com.javaweb.repositories.UserRepository;
import com.javaweb.services.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(long id) {
        return this.userRepository.getById(id);
    }

    public User getUserByEmail(String email){
        return this.userRepository.findByEmail(email);
    }


}
