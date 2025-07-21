package dev.likeech.java.service.impl;


import dev.likeech.java.repository.CourseRepository;
import dev.likeech.java.repository.DiscountEventRepository;
import dev.likeech.java.service.DiscountEventService;
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
