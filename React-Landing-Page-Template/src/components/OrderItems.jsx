import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";
import axios from "axios";

export const OrderItems = () => {
    const [orderData, setOrderData] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState(0);
    const [userInfo, setUserInfo] = useState({});
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!location.state || !location.state.orderItemsData) {
            navigate("/order-history");
        } else {
            setOrderData(location.state.orderItemsData);
            setOrderId(location.state.orderId);
        }
    }, [location, navigate]);

    // useEffect(async () => {
    //     const res = await axios.get("http://localhost:8080/api/users/account/profile", {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     });
    //     setUserInfo(res.data);
    // }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/users/account/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserInfo(res.data);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);


    const totalAmount = orderData.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="container" style={{ paddingTop: "120px", minHeight: "70vh" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>
                    <strong>Đơn hàng:</strong> #{orderId || "N/A"}
                </h4>
            </div>

            <h5 className="fw-bold mb-3">Chi tiết đơn hàng</h5>

            <div className="border rounded shadow-sm mb-4">
                {orderData.map((item) => (
                    <div key={item.orderItemId} className="d-flex justify-content-between align-items-center border-bottom p-3">
                        <div className="d-flex align-items-center gap-3 flex-grow-1">
                            <img
                                src={encodeURI(`http://localhost:8080/images/${item.course.imageUrl}`) || "/images/default-course.png"}
                                alt="Course"
                                style={{ width: "80px", height: "50px", objectFit: "cover" }}
                            />
                            <div>
                                <p className="mb-1 fw-bold">{item.course.title}</p>
                                <small className="text-muted">{item.course.description}</small>
                            </div>
                        </div>

                        {/* Giá tiền to và cách nút View một khoảng */}
                        <div className="text-success fw-bold fs-5 me-4" style={{ minWidth: "150px", textAlign: "right" }}>
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
                        <p className="mb-1"><strong>Full name:</strong> {userInfo.fullName}</p>
                        <p className="mb-1"><strong>Country:</strong> VN</p>
                        <p className="mb-1"><strong>Email:</strong> {userInfo.email}</p>
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

