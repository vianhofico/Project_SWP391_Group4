import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";

export const OrderItems = () => {
    const [orderData, setOrderData] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!location.state || !location.state.orderItemsData) {
            navigate("/order-history");
        } else {
            setOrderData(location.state.orderItemsData);
        }
    }, [location, navigate]);

    const formatDate = (dateStr) => {
        const parsed = dayjs(dateStr);
        return parsed.isValid() ? parsed.format("DD/MM/YYYY HH:mm") : "Không rõ";
    };

    const totalAmount = orderData.reduce((sum, item) => sum + item.price, 0);

    // Giả lập thông tin người dùng (thực tế lấy từ backend)
    const userInfo = {
        fullName: "Tùng Tô",
        country: "VN",
        email: "he182488toquoctung@gmail.com",
    };

    return (
        <div className="container" style={{ paddingTop: "120px", minHeight: "70vh" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>
                    <strong>Order:</strong> #{orderData[0]?.order?.id || "N/A"}
                </h4>
                <div className="text-end">
                    <p className="mb-1"><strong>Date:</strong> {formatDate(orderData[0]?.order?.createdAt)}</p>
                    <button className="btn btn-outline-secondary btn-sm">🖨 PRINT</button>
                </div>
            </div>

            <h5 className="fw-bold mb-3">Order details</h5>

            <div className="border rounded shadow-sm mb-4">
                {orderData.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom p-3">
                        <div className="d-flex align-items-center gap-3">
                            <img
                                src={item.course.image || "/images/default-course.png"}
                                alt="Course"
                                style={{ width: "80px", height: "50px", objectFit: "cover" }}
                            />
                            <div>
                                <p className="mb-1 fw-bold">{item.course.title}</p>
                                <small className="text-muted">{item.course.description}</small>
                            </div>
                        </div>
                        <div className="fw-bold text-success">
                            {item.price.toLocaleString()} đ
                        </div>
                        <div>
                            <button className="btn btn-outline-secondary btn-sm">View</button>
                        </div>
                    </div>
                ))}
                <div className="d-flex justify-content-end p-3 fw-bold">
                    Total: <span className="ms-2">{totalAmount.toLocaleString()} đ</span>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="border rounded p-3">
                        <h6 className="fw-bold mb-3">Address</h6>
                        <p className="mb-1"><strong>Full name:</strong> {userInfo.fullName}</p>
                        <p className="mb-1"><strong>Address:</strong> {userInfo.address}</p>
                        <p className="mb-1"><strong>Country:</strong> {userInfo.country}</p>
                        <p className="mb-1"><strong>Email:</strong> {userInfo.email}</p>
                        <p className="mb-0"><strong>Phone:</strong> {userInfo.phone}</p>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="border rounded p-3">
                        <h6 className="fw-bold mb-3">Total Billed</h6>
                        <p className="mb-1"><strong>Payment method:</strong> Chuyển Khoản Ngân Hàng</p>
                        <p className="mb-1"><strong>Total:</strong> {totalAmount.toLocaleString()} đ</p>
                        <p className="mb-0">
                            <strong>Status:</strong>{" "}
                            <span className="badge bg-success">COMPLETED</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
                <button
                    className="btn btn-outline-secondary px-4 py-2"
                    onClick={() => navigate("/order-history")}
                >
                    ← Quay về lịch sử
                </button>
            </div>
        </div>
    );
};

export default OrderItems;

