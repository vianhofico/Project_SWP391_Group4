import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [courseDetails, setCourseDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetchPurchasedCourses(token);
    }, [navigate]);

    const fetchPurchasedCourses = async (token) => {
        try {
            const res = await axios.get("http://localhost:8080/api/purchased-courses", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const courseIds = Array.isArray(res.data) ? res.data : [];

            if (courseIds.length === 0) {
                setCourseDetails([]);
                return;
            }

            setPurchasedCourses(courseIds);

            const detailRes = await axios.get("http://localhost:8080/api/courses", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = Array.isArray(detailRes.data) ? detailRes.data : [];
            setCourseDetails(data);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu khóa học đã mua:", err);
        }
    };

    return (
        <div className="container mt-5 pt-4">
            <h4 className="mb-4 fw-bold">Khóa học của tôi</h4>
            {courseDetails.length === 0 ? (
                <p>Bạn chưa mua khóa học nào.</p>
            ) : (
                <div className="row">
                    {courseDetails.map(course => (
                        <div key={course.courseId} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm text-center p-3">
                                <img
                                    src={encodeURI(course.imageUrl || "/default-course.jpg")}
                                    alt={course.title}
                                    style={{ width: "100%", height: "180px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h6 className="card-title fw-bold">{course.title}</h6>
                                    <p className="card-text text-truncate">{course.description || "Không có mô tả."}</p>
                                    <div className="text-success fw-bold mt-2">Đã mua</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCourses;
