package com.javaweb.services;

import com.javaweb.entities.User;

public interface UserService {
    User getUserById(long id);

    User getUserByEmail(String email);

}
