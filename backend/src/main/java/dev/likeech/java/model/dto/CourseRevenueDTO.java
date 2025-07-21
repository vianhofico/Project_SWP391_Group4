package dev.likeech.java.model.dto;

public class CourseRevenueDTO {
    private Long courseId;
    private String title;
    private Double revenue;
//    private Long revenue;
    private Long studentCount;

    public CourseRevenueDTO(Long courseId, String title, Double revenue, Long studentCount) {
        this.courseId = courseId;
        this.title = title;
        this.revenue = revenue;
        this.studentCount = studentCount;
    }

    // Getters and setters

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

//    public Long getRevenue() {
//        return revenue;
//    }
//
//    public void setRevenue(Long revenue) {
//        this.revenue = revenue;
//    }


    public Double getRevenue() {
        return revenue;
    }

    public void setRevenue(Double revenue) {
        this.revenue = revenue;
    }

    public Long getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(Long studentCount) {
        this.studentCount = studentCount;
    }
}
