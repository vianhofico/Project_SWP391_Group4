import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [courseDetails, setCourseDetails] = useState([]);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetchPurchasedCourses(token);
    }, [navigate]);

    const filteredCourses = courseDetails.filter(course => {
        if (activeTab === 'all') return true;
        if (activeTab === 'completed') return false; // Thay bằng logic thực tế
        if (activeTab === 'inProgress') return true; // Thay bằng logic thực tế
        return true;
    });

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
        <div className="my-courses-container" style={{
            paddingTop: '80px', // Thêm padding-top để tránh navbar
            minHeight: '100vh',
            backgroundColor: '#f8f9fa'
        }}>
            <div className="container mt-4">
                <h1 className="mb-3">Các khóa học đã tham gia</h1>

                {/* Các tab trạng thái */}
                <div className="d-flex mb-4">
                    <button
                        className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                        onClick={() => setActiveTab('all')}
                    >
                        All ({courseDetails.length})
                    </button>
                    <button
                        className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed (0)
                    </button>
                    <button
                        className={`btn ${activeTab === 'inProgress' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveTab('inProgress')}
                    >
                        In progress (2)
                    </button>
                </div>

                {filteredCourses.length === 0 ? (
                    <p>Không có khóa học nào.</p>
                ) : (
                    <div className="row">
                        {filteredCourses.map(course => (
                            <div key={course.courseId} className="col-md-4 mb-4">
                                <div className="card h-100 shadow-sm rounded-4 overflow-hidden border-0">
                                    <img
                                        src={encodeURI(course.imageUrl || "/default-course.jpg")}
                                        alt={course.title}
                                        className="card-img-top"
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <div className="card-body d-flex flex-column text-center px-4">
                                        <h6 className="card-title fw-bold text-truncate">{course.title}</h6>
                                        <p className="card-text text-muted small text-truncate">
                                            {course.description || "Không có mô tả."}
                                        </p>
                                        <span className="badge bg-success mb-3 px-3 py-1 align-self-center">Đã mua</span>

                                        {/* Nút chức năng */}
                                        <div className="d-flex justify-content-center gap-2 mt-auto">
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => navigate(`/courses/${course.courseId}`)}
                                            >
                                                Xem chi tiết
                                            </button>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => navigate(`/learn/${course.courseId}`)}
                                            >
                                                Học ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

};

export default MyCourses;


