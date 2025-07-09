import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";



export const OrderHistory = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [page, setPage] = useState(0);        // Trang hiện tại (bắt đầu từ 0)
    const [pageSize] = useState(5);             // Số đơn hàng mỗi trang
    const navigate = useNavigate();
    const token = localStorage.getItem("token");


    const formatFullDate = (str) => {
        const parsed = dayjs(str, "DD/MM/YYYY HH:mm");
        if (!parsed.isValid()) return "Không rõ";
        return parsed.format("DD/MM/YYYY HH:mm");
    };

    useEffect(async () => {
        const response = await axios.get("http://localhost:8080/api/order-history", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const items = response.data;
        setOrderItems(Array.isArray(items) ? items : []);
    }, []);

    const fetchOrderItem = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const orderItemsData = response.data; // giả sử backend trả về danh sách CartItem
            navigate("/order-items", {state: {orderItemsData}})
        } catch (error) {
        }
    };

    const totalPages = Math.ceil(orderItems.length / pageSize);
    const currentItems = orderItems.slice(page * pageSize, (page + 1) * pageSize);

    return (
        <div className="container" style={{ paddingTop: "100px", minHeight: "70vh" }}>
            {orderItems.length === 0 ? (
                <div className="text-center">
                    <img
                        src="/images/empty-order.png"
                        alt="No Orders"
                        style={{ width: "200px", marginBottom: "20px" }}
                    />
                    <h4 className="text-muted">Bạn chưa có đơn hàng nào.</h4>
                    <p className="text-secondary">Hãy khám phá khoá học hấp dẫn ngay hôm nay!</p>
                    <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
                        Khám phá khoá học
                    </button>
                </div>
            ) : (
                <>
                    <h2 className="text-center fw-bold mb-4 text-uppercase">
                        🧾 Lịch sử mua hàng
                    </h2>

                    <div className="d-flex flex-column gap-4">
                        {currentItems.map((item) => (
                            <div key={item.orderId} className="border rounded shadow-sm p-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="fw-bold text-success">
                                        🟢 ĐÃ HOÀN THÀNH
                                    </div>
                                    <div className="text-end">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => fetchOrderItem(item.orderId)}
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-8">
                                        <p className="mb-1">
                                            <strong>Mã đơn hàng:</strong> #{item.orderId}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Date:</strong> {formatFullDate(item.createdAt)}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Payment Method:</strong> Chuyển Khoản Ngân Hàng
                                        </p>
                                    </div>
                                    <div className="col-md-4 text-end">
                                        <h5 className="text-dark mb-0">
                                            {item.amount.toLocaleString()} đ
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                        >
                            ← Trang trước
                        </button>
                        <span className="fw-bold">
                            {totalPages > 0 ? `${page + 1} / ${totalPages}` : "0 / 0"}
                        </span>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Trang sau →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderHistory;

