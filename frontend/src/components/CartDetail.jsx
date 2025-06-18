import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const CartDetail = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/cart`);
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/delete-cart-course/${id}`);
            fetchCart();
        } catch (error) {
            console.error("Lỗi khi xoá sản phẩm:", error);
        }
    };

    const handleCheckboxChange = (e, id) => {
        if (e.target.checked) {
            setSelectedItems((prev) => [...prev, id]);
        } else {
            setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
        }
    };



    const handleCheckout = async () => {

        const validIds = selectedItems.filter((id) => id !== null && id !== undefined);

        if (validIds.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Chưa chọn sản phẩm',
                text: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/confirm-checkout", selectedItems);
            const checkoutData = response.data; // giả sử backend trả về danh sách CartItem

            navigate("/confirm-checkout", { state: { checkoutData } }); // truyền dữ liệu qua state
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu thanh toán:", error);
        }
    };

    return (
        <div style={{ paddingTop: '100px' }}>
            {cartItems.length === 0 ? (
                <p color="red">Không có sản phẩm nào trong giỏ hàng</p>
            ) : (
                <div className="container py-5">
                    <h2>Giỏ hàng</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Ảnh</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Xoá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            onChange={(e) => handleCheckboxChange(e, item.id)}
                                        />
                                    </td>
                                    <td>
                                        <img
                                            src={`http://localhost:8080/images/product/${item.courseDTO.image}`}
                                            alt=""
                                            style={{ width: 80, height: 80, objectFit: "cover" }}
                                        />
                                    </td>
                                    <td>{item.courseDTO.title}</td>
                                    <td>{item.courseDTO.price.toLocaleString()} đ</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h4 className="mt-4">Tổng tiền: {totalPrice.toLocaleString()} đ</h4>
                    <button className="btn btn-success mt-2" onClick={handleCheckout}>
                        Tiến hành thanh toán
                    </button>
                </div>)}
        </div>
    );
};

export default CartDetail;
