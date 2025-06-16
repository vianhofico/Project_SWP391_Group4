// "use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

// import "bootstrap/dist/css/bootstrap.min.css";

const CheckoutPage = () => {
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const storedData = localStorage.getItem("checkoutData");
        // if (storedData) {
        const items = JSON.parse(storedData);
        setCartItems(items);

        const total = items.reduce((sum, item) => sum + (item.courseDTO?.price || 0), 0);
        setTotalPrice(total);
        // } else {
        //     fetchCart();
        // }
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/confirm-checkout`);
            const priceResponse = await axios.get(`http://localhost:8080/api/cartPrice`);

            setCartItems(Array.isArray(response.data) ? response.data : []);
            setTotalPrice(priceResponse.data || 0);
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            setCartItems([]);
            setTotalPrice(0);
        }
    };

    const handleConfirmPayment = async () => {
        try {
            setLoading(true);

            const storedData = localStorage.getItem("checkoutData");
            const items = JSON.parse(storedData);
            setCartItems(items);

            const selectedIds = items.map((item) => item.id);
            await axios.post("http://localhost:8080/api/place-order", selectedIds);
            window.dispatchEvent(new Event("cartUpdated"));

            await axios.get("http://localhost:8080/api/send-html-email");

            Swal.fire({
                title: "🎉 Thanh toán thành công!",
                text: "Cảm ơn bạn đã mua khoá học.",
                icon: "success",
                confirmButtonText: "Về trang chủ"
            }).then(() => {
                router.push("/"); // điều hướng sau khi đóng popup
            });

            // router.push("/");
        } catch (error) {
            console.error("Lỗi khi xử lý thanh toán:", error);
            Swal.fire({
                title: "Lỗi!",
                text: "Đã có lỗi xảy ra trong quá trình thanh toán.",
                icon: "error",
                confirmButtonText: "Thử lại"
            });
            // alert("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.");
        }
        finally {
            setLoading(false);
        }
    };


    return (
        <div className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            {/* Overlay loading */}
            {loading && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
                    <div className="bg-white p-4 rounded shadow text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="fw-semibold">Đang xử lý đơn hàng...</p>
                    </div>
                </div>
            )}

            <div className="text-center mb-4" style={{ paddingTop: '100px' }}>
                {/* <h2 className="fw-bold">Giỏ hàng</h2> */}
            </div>

            <div className="w-100" style={{ maxWidth: '1500px' }}>
                <table className="table-auto w-full text-center border border-gray-200 shadow-sm">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th scope="col">Ảnh</th>
                            <th scope="col">Tên khoá học</th>
                            <th scope="col">Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2">
                                    <img
                                        src={`http://localhost:8080/images/product/${item.courseDTO.image}`}
                                        alt=""
                                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                                        className="w-20 h-20 object-cover rounded"

                                    />
                                </td>
                                <td className="px-4 py-2 fw-semibold">{item.courseDTO.title}</td>
                                <td className="px-4 py-2 text-red-600 fw-bold">
                                    {item.courseDTO?.price.toLocaleString()} đ
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-end mt-3">
                    <h4 className="text-success">Tổng tiền: {totalPrice.toLocaleString()} đ</h4>
                </div>

                <div className="text-center mt-5">
                    <h3>Xác nhận thanh toán</h3>
                    <p className="text-muted">Vui lòng kiểm tra lại thông tin trước khi thanh toán.</p>
                </div>

                <div className="d-flex justify-content-center gap-3 mt-3">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
                        onClick={handleConfirmPayment}
                        disabled={loading}
                    >
                        {loading ? " Đang xử lý..." : " Xác nhận thanh toán"}
                    </button>

                    <button className="border border-gray-400 hover:bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-lg" onClick={() => router.back()}>
                        Quay lại giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
};


export default CheckoutPage;
