package dev.likeech.java.mapper;

import dev.likeech.java.entity.User;
import dev.likeech.java.model.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UserDTOConverter {
    private final ModelMapper modelMapper;
    private final DateTimeConverter dateTimeConverter;
    public UserDTO toDTO(User user) {
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        userDTO.setStatus((user.getIsActive() != null && user.getIsActive()) ? "Active" : "Inactive");
        userDTO.setCreatedAt(dateTimeConverter.toString(user.getCreatedAt()));
        userDTO.setBirthDate(dateTimeConverter.toString(user.getBirthDate()));
        return userDTO;
    }
}
