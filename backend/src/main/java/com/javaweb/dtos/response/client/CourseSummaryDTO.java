package com.javaweb.dtos.response.client;

public class CourseSummaryDTO {
    private Long courseId;
    private String title;
    private String imageUrl;
    private Long price;

    public CourseSummaryDTO() {
    }

    public CourseSummaryDTO(Long courseId, String title, String imageUrl, Long price) {
        this.courseId = courseId;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getPrice() {
        return price;
    }

    public void setPrice(Long price) {
        this.price = price;
    }
}

