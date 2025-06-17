import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const CheckoutPage = () => {

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // fetchCart();
        if (location.state && location.state.checkoutData) {
            const items = location.state.checkoutData;
            setCartItems(items);

            const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
            setTotalPrice(total);
        } else {
            // fallback nếu không có dữ liệu
            fetchCart(); // chỉ gọi khi cần (ví dụ người dùng F5)
        }
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/confirm-checkout2`);
            const priceResponse = await axios.get(`http://localhost:8080/api/cartPrice`);

            const items = response.data;
            const price = priceResponse.data;

            setCartItems(Array.isArray(items) ? items : []);
            setTotalPrice(price || 0);
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            setCartItems([]);
            setTotalPrice(0);
        }
    };

    const handleConfirmPayment = async () => {
        // TODO: Gọi API xác nhận thanh toán thực tế            
        const selectedIds = cartItems.map(item => item.id);

        await axios.post(`http://localhost:8080/api/place-order`, selectedIds);
        navigate("/"); // truyền dữ liệu qua state
        // await axios.get(`http://localhost:8080/send-email`);
        // await axios.get(`http://localhost:8080/send-email-with-attachment`);
        await axios.get(`http://localhost:8080/send-html-email`);
        alert("Thanh toán thành công!");
    };

    return (

        <div className="container py-5">
            <div className="container py-5">
                <h2>Giỏ hàng</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>

                                <td>
                                    <img
                                        src={`http://localhost:8080/images/product/${item.courseDTO.image}`}
                                        alt=""
                                        style={{ width: 80, height: 80, objectFit: "cover" }}
                                    />
                                </td>
                                <td>{item.courseDTO.title}</td>
                                <td>{item.courseDTO.price.toLocaleString()} đ</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h4 className="mt-4">Tổng tiền: {totalPrice.toLocaleString()} đ</h4>

            </div>
            <h2>Xác nhận thanh toán</h2>
            <p>Vui lòng kiểm tra lại thông tin trước khi thanh toán.</p>

            {/* Bạn có thể thêm thông tin đơn hàng ở đây nếu cần */}

            <div className="mt-4">
                <button className="btn btn-primary me-2" onClick={handleConfirmPayment}>
                    Xác nhận thanh toán
                </button>
                <button className="btn btn-secondary" onClick={() => window.history.back()}>
                    Quay lại giỏ hàng
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;
