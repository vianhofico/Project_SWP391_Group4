// "use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
// import "bootstrap/dist/css/bootstrap.min.css";


export const OrderHistory = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);

    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/cart`);


            const priceResponse = await axios.get(`http://localhost:8080/api/cartPrice`);

            const items = response.data;
            const price = priceResponse.data;


            const numberOfCourse = response.data.length;
            localStorage.setItem("numberOfCourse", numberOfCourse);

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
            window.dispatchEvent(new Event("cartUpdated"));

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
                title: "Lỗi!",
                text: "Vui lòng chọn ít nhất một sản phẩm để thanh toán..",
                icon: "error",
                confirmButtonText: "Thử lại"
            });
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/confirm-checkout", selectedItems);
            const checkoutData = response.data; // giả sử backend trả về danh sách CartItem

            localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

            router.push("/confirm-checkout");

        } catch (error) {
            Swal.fire({
                title: "Lỗi!",
                text: "Đã có lỗi xảy ra trong quá trình thanh toán.",
                icon: "error",
                confirmButtonText: "Thử lại"
            });
        }
    };

    return (
        <div style={{ paddingTop: '150px' }}>
            {cartItems.length === 0 ? (
                <p color="red">Không có sản phẩm nào trong giỏ hàng</p>
            ) : (
                <div className="container py-5">
                    <h2>Giỏ hàng</h2>
                    <table className="table-auto w-full text-center border border-gray-200 shadow-sm">
                        <thead className="bg-gray-800 text-white">
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
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow" onClick={handleCheckout}>
                        Tiến hành thanh toán
                    </button>
                </div>)}
        </div>
    );
};

export default OrderHistory;
