package com.javaweb.converter;

import com.javaweb.dto.UserDTO;
import com.javaweb.entity.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserDTOConverter {

    private final ModelMapper modelMapper;

    public UserDTO toUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO = modelMapper.map(user, UserDTO.class);
        userDTO.setStatus((user.getIsActive() ? "Active" : "Inactive"));
        return userDTO;
    }
}
