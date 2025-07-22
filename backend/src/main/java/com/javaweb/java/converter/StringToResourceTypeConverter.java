package com.javaweb.java.converter;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import com.javaweb.java.enums.ResourceType;
@Component
public class StringToResourceTypeConverter implements Converter<String, ResourceType> {
    @Override
    public ResourceType convert(String source) {
        try {
            return ResourceType.valueOf(source.toLowerCase()); // enum đang là chữ thường
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid resource type: " + source);
        }
    }
}
