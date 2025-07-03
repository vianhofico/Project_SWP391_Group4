// "use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// import "bootstrap/dist/css/bootstrap.min.css";


export const OrderHistory = () => {
    const [orderItems, setOrderItems] = useState([]);
    // const [cartItems, setCartItems] = useState([]);
    // const [totalPrice, setTotalPrice] = useState(0);
    // const [selectedItems, setSelectedItems] = useState([]);

    // const router = useRouter();

    useEffect(() => {
        fetchOrder();
    }, []);



    const fetchOrder = async () => {
        try {
            // const response = await axios.get(`http://localhost:8080/api/cart`);
            const response = await axios.get(`http://localhost:8080/api/order-history`);

            const items = response.data;

            // setOrderItems(items);
            // const numberOfCourse = response.data.length;
            // localStorage.setItem("numberOfCourse", numberOfCourse);

            setOrderItems(Array.isArray(items) ? items : []);
            // setTotalPrice(price || 0);
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            // setCartItems([]);
            // setTotalPrice(0);
        }
    };

    const fetchOrderItem = async (id) => {

        // const validIds = selectedItems.filter((id) => id !== null && id !== undefined);


        try {
            // const response = await axios.post("http://localhost:8080/api/confirm-checkout", selectedItems);
            const response = await axios.get(`http://localhost:8080/api/order-items/${id}`);
            setOrderItems(response.data);
            const orderItemsData = response.data; // giả sử backend trả về danh sách CartItem

            localStorage.setItem("orderItemsData", JSON.stringify(orderItemsData));

            // router.push("/order-items");

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
            {orderItems.length === 0 ? (
                <p color="red">Không có đơn hàng nào được thực hiện</p>
            ) : (
                <div className="container py-5">
                    <h2>Lịch sử mua hàng</h2>
                    <table className="table-auto w-full text-center border border-gray-200 shadow-sm">
                        <thead className="bg-gray-800 text-white">
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Tổng tiền</th>
                            <th>Chi tiết đơn hàng</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderItems.map((item) => (
                            <tr key={item.orderId}>

                                <td>{item.orderId}</td>
                                <td>{item.totalPrice.toLocaleString()} đ</td>
                                <td>
                                    <button onClick={() => fetchOrderItem(item.orderId)}>
                                        Chi tiết đơn hàng
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* <h4 className="mt-4">Tổng tiền: {totalPrice.toLocaleString()} đ</h4>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow" onClick={handleCheckout}>
                        Tiến hành thanh toán
                    </button> */}
                </div>)}
        </div>
    );
};

export default OrderHistory;
