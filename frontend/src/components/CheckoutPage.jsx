import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
import {useNavigate, useLocation} from "react-router-dom";
import Swal from 'sweetalert2';

const CheckoutPage = () => {

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const totalRef = useRef(0);
    const location = useLocation();
    const navigate = useNavigate();
    const [lastId, setLastId] = useState(0);
    const intervalRef = useRef(null);
    const hasShownPopup = useRef(false);
    const hasShownErrorPopup = useRef(false);
    const lastIdRef = useRef(0);
    const lastTransactionIdRef = useRef("");  // lưu giao dịch đã xử lý
    const lastRowCountRef = useRef(0);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!location.state || !location.state.checkoutData) {
            // Nếu không có dữ liệu từ CartDetail => Redirect
            navigate("/cart");
        }
    }, [location, navigate]);

    useEffect(() => {
        const initRowCount = async () => {
            try {
                // const response = await fetch("https://script.google.com/macros/s/AKfycbwqdfAnrurKdOwl8IOOGfbeIbVKkn22xk0jFQF0WH5dsBAXRbsJHHzeSUPH-7knLqX37w/exec");
                // const response = await fetch("https://script.google.com/macros/s/" +
                //     "AKfycbwDDJS3Nu5S8NgloZ9gOk1v-qeZWVFYdh3jXgR14ZIeWT6FtmQOsACk7dENZI__4bGFnA/exec");
                const response = await fetch("https://script.google.com/macros/s/" +
                    "AKfycbwiQLj6dfgA-n5d4tvaaL2PH1y3PzmKFkceJnjvCLZMTqgxcKOc5Hx7idR-C4YsjzxI/exec");
                const data = await response.json();
                lastRowCountRef.current = data.data.length;
            } catch (error) {
                console.error("Lỗi khi khởi tạo số dòng Google Sheet:", error);
            }
        };
        initRowCount();
    }, []);


    useEffect(() => {
        const fetchLastId = async () => {
            const response = await axios.get("http://localhost:8080/api/last-order-id", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            lastIdRef.current = response.data + 2;
        }
        fetchLastId();
    }, []);

    useEffect(async () => {
        const response = await axios.get("http://localhost:8080/api/last-order-id", {
            headers : {
                Authorization: `Bearer ${token}`
            }
        });
        setLastId(response.data + 2);
    }, []);

    useEffect(() => {
        if (location.state && location.state.checkoutData) {
            const items = location.state.checkoutData;
            setCartItems(items);
            localStorage.setItem("checkoutIds", JSON.stringify(items.map(item => item.id)));
        }
    }, []);

    useEffect(() => {
        if (location.state && location.state.checkoutData) {
            const items = location.state.checkoutData;
            setCartItems(items);
            const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
            setTotalPrice(total);
            totalRef.current = total;
        } else {
            // fallback nếu không có dữ liệu
            fetchCart(); // chỉ gọi khi cần (ví dụ người dùng F5)
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                checkPaid();
            }, 1000);
        }, 5000);

        return () => {
            clearTimeout(timeoutId);      // dọn timeout khi component unmount
            clearInterval(intervalRef.current); // dọn interval
        };
    }, []);


    const fetchCart = async () => {
        try {
            const selectedIds = cartItems.map(item => item.id);
            const response = await axios.post("http://localhost:8080/api/confirm-checkout", selectedIds, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const priceResponse = await axios.get("http://localhost:8080/api/cartPrice", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const items = response.data;
            const price = priceResponse.data;

            setCartItems(Array.isArray(response.data) ? response.data : []);
            setTotalPrice(price || 0);
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            setCartItems([]);
            setTotalPrice(0);
        }
    };

    async function checkPaid() {
        try {
            // const response = await fetch("https://script.google.com/macros/s/" +
            //     "AKfycbwqdfAnrurKdOwl8IOOGfbeIbVKkn22xk0jFQF0WH5dsBAXRbsJHHzeSUPH-7knLqX37w/exec");
            // const response = await fetch("https://script.google.com/macros/s/" +
            //     "AKfycbyANXU125xRQSXMNjcXiRgk_3jLfHjRCzhqCD_zrZpWy2b-2_b0oTOIJTqo52EmG2khkA/exec");
            // const response = await fetch("https://script.google.com/macros/s/" +
            //     "AKfycbxt-gpf37dD3qp9rBvef3D3wLhC-Eqg2nXOBzmYiOnUwMopEEuXuvQV-uqoxmqGxFHudQ/exec");
            const response = await fetch("https://script.google.com/macros/s/" +
                "AKfycbwiQLj6dfgA-n5d4tvaaL2PH1y3PzmKFkceJnjvCLZMTqgxcKOc5Hx7idR-C4YsjzxI/exec");
            const data = await response.json();
            const lastPaid = data.data[data.data.length - 1];

            const transactionId = lastPaid["Mô tả"];

            if (transactionId === lastTransactionIdRef.current) return;

            lastTransactionIdRef.current = transactionId;

            let lastPrice = lastPaid["Giá trị"];
            const index = lastPaid["Mô tả"].toLowerCase().indexOf("ma");
            let lastContent = "ORDER" + lastPaid["Mô tả"].substring(5, index);
            const paidContent = `ORDER${lastIdRef.current}`;
            // if(lastContent.includes(paidContent) && (parseInt(lastPrice) === totalRef.current)&& !hasShownPopup.current){
            if (transactionId.includes(paidContent) && (parseInt(lastPrice) === totalRef.current / 100) && !hasShownPopup.current) {
                const storedIds = JSON.parse(localStorage.getItem("checkoutIds") || "[]");
                await axios.post("http://localhost:8080/api/place-order", storedIds, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // cap nhat lai gio hang (xoa cac san pham duoc thanh toan ra khoi gio hang)
                const cartResponse = await axios.get("http://localhost:8080/api/cart", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                localStorage.setItem("cartItems", JSON.stringify(cartResponse.data || []));
                window.dispatchEvent(new Event("cartUpdated"));
                hasShownPopup.current = true;
                clearInterval(intervalRef.current);
                Swal.fire({
                    icon: 'success',
                    title: 'Thanh toán thành công',
                    text: 'Cảm ơn bạn đã đặt hàng.',
                    confirmButtonText: 'Về trang chủ'
                }).then(() => {
                    navigate("/");
                });
                await axios.get("http://localhost:8080/api/send-html-email", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        } catch {
            console.log("Error");
        }
    }



    const handleCancelPayment = () => {
        Swal.fire({
            title: 'Bạn có chắc muốn hủy đơn hàng?',
            text: "Nếu xác nhận, bạn sẽ quay lại trang chủ.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận hủy đơn',
            cancelButtonText: 'Bỏ, tiếp tục thanh toán'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/");
            }
            // Nếu nhấn cancel thì không làm gì
        });
    };


    return (
        <div style={{ paddingTop: '100px' }}>
            <div className="container py-5">
                <h2 className="mb-4">Xác nhận đơn hàng</h2>
                <div className="row">
                    {/* Cột trái: Danh sách sản phẩm */}
                    <div className="col-md-8">
                        {cartItems.map((item) => {
                            const originalPrice = item.course?.originalPrice || item.course.price;
                            const finalPrice = item.price;

                            return (
                                <div className="d-flex align-items-center border-bottom py-3" key={item.id}>
                                    {/* Ảnh đại diện */}
                                    <div className="me-3">
                                        <img
                                            src={encodeURI(item.course.imageUrl)}
                                            alt={item.course.title}
                                            className="img-thumbnail"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        />
                                    </div>

                                    <div className="flex-grow-1">
                                        <h5 className="mb-1">{item.course.title}</h5>
                                    </div>

                                    <div className="text-end">
                                        {finalPrice < originalPrice ? (
                                            <>
                                                <div className="text-danger fw-bold fs-5">
                                                    {finalPrice.toLocaleString()} đ
                                                </div>
                                                <div className="text-muted text-decoration-line-through fs-5">
                                                    {originalPrice.toLocaleString()} đ
                                                </div>
                                            </>
                                        ) : (
                                            <div className="fs-5">{finalPrice.toLocaleString()} đ</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Cột phải: QR và tổng kết */}
                    <div className="col-md-4">
                        <div className="border p-3 rounded">
                            <h5 className="mb-3">Tổng thanh toán</h5>
                            <ul className="list-unstyled">
                                <li className="d-flex justify-content-between">
                                    <span>Tạm tính:</span>
                                    <strong>{totalPrice.toLocaleString()} đ</strong>
                                </li>
                                <hr />
                                <li className="d-flex justify-content-between fs-5">
                                    <strong>Tổng cộng:</strong>
                                    <strong>{totalPrice.toLocaleString()} đ</strong>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-4 text-center">
                            <h6 className="mb-3">Quét mã để thanh toán</h6>
                            <img
                                src={`https://img.vietqr.io/image/mbbank-0969064150-compact2.jpg?amount=${totalPrice / 100}&addInfo=ORDER_${lastId}&accountName=To%20Quoc%20Tung`}
                                alt="QR Thanh toán"
                                style={{ width: 300 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Nút điều hướng */}
                <div className="row mt-4">
                    <div className="col-md-8 d-flex justify-content-center gap-3 align-items-center">
                        <button className="btn btn-secondary" onClick={() => window.history.back()}>
                            ← Quay lại giỏ hàng
                        </button>
                        <button className="btn btn-outline-danger" onClick={handleCancelPayment}>
                            Hủy thanh toán
                        </button>
                    </div>
                    {/* Cột phải trống để giữ căn chỉnh layout */}
                    <div className="col-md-4"></div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;