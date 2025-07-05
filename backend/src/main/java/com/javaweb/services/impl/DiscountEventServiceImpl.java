package com.javaweb.services.impl;

import com.javaweb.repositories.CourseRepository;
import com.javaweb.repositories.DiscountEventRepository;
import com.javaweb.services.DiscountEventService;
import org.springframework.stereotype.Service;

@Service
public class DiscountEventServiceImpl implements DiscountEventService {

    private final DiscountEventRepository discountEventRepository;
    private final CourseRepository courseRepository;

    public DiscountEventServiceImpl(DiscountEventRepository discountEventRepository, CourseRepository courseRepository) {
        this.discountEventRepository = discountEventRepository;
        this.courseRepository = courseRepository;
    }



    @Override
    public void delete(Long id) {
        if (!discountEventRepository.existsById(id)) {
            throw new RuntimeException("Event not found");
        }
        discountEventRepository.deleteById(id);
    }
}
