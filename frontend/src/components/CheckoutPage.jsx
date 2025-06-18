import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

const CheckoutPage = () => {

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const totalRef = useRef(0);
    const location = useLocation();
    const navigate = useNavigate();
    const [lastId, setLastId] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const intervalRef = useRef(null);
    const hasShownPopup = useRef(false);
    const lastIdRef = useRef(0);

    useEffect(() => {
       const fetchLastId = async() => {
           const response = await axios.get("http://localhost:8080/api/last-order-id");
           lastIdRef.current = response.data + 2;
       }
       fetchLastId();
    }, []);

    useEffect(async() => {
        const response = await axios.get("http://localhost:8080/api/last-order-id");
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
            const response = await axios.post("http://localhost:8080/api/confirm-checkout", selectedIds);
            const priceResponse = await axios.get("http://localhost:8080/api/cartPrice");

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
        if(isSuccess===true){
            return;
        } else{
            try {
                const response = await fetch("https://script.google.com/macros/s/AKf" +
                    "ycbybYFrQxZDgZgJJZgr4CVyTSOR4GSVWLB3-yrRfLzzrTixLCEwGHDVBMoPy3IHPQJQaVg/exec"
                );
                const data = await response.json();
                const lastPaid = data.data[data.data.length - 1];
                let lastPrice = lastPaid["Giá trị"];
                const index = lastPaid["Mô tả"].toLowerCase().indexOf("ma");
                let lastContent = "ORDER" + lastPaid["Mô tả"].substring(5, index);
                const paidContent = `ORDER${lastIdRef.current}`;
                // console.log("lastPrice:", lastPrice);
                // console.log("totalPrice:", totalRef.current / 100);
                // console.log(totalRef.current / 100 === parseInt(lastPrice));

                if(lastContent.includes(paidContent) && (parseInt(lastPrice) === totalRef.current / 100 )&& !hasShownPopup.current){
                    const storedIds = JSON.parse(localStorage.getItem("checkoutIds") || "[]");
                    await axios.post("http://localhost:8080/api/place-order", storedIds);

                    hasShownPopup.current = true;
                    clearInterval(intervalRef.current);
                    setIsSuccess(true);
                    Swal.fire({
                        icon: 'success',
                        title: 'Thanh toán thành công',
                        text: 'Cảm ơn bạn đã đặt hàng.',
                        confirmButtonText: 'Về trang chủ'
                    }).then(() => {
                        navigate("/");
                        // navigate("/order-history", {state: {checkoutData}});
                    });
                    await axios.get("http://localhost:8080/api/send-html-email");
                }
            }catch {
                console.log("Error");
            }
        }

    }


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
            <img
                src={`https://img.vietqr.io/image/mbbank-0969064150-compact2.jpg?amount=${totalPrice / 100}
                    &addInfo=ORDER_${lastId}&accountName=To%20Quoc%20Tung`}
                alt="QR Thanh toán"
                style={{ width: 300 }}
            />


            <div className="mt-4">
                {/*<button className="btn btn-primary me-2" onClick={handleConfirmPayment}>*/}
                {/*    Xác nhận thanh toán*/}
                {/*</button>*/}
                <button className="btn btn-secondary" onClick={() => window.history.back()}>
                    Quay lại giỏ hàng
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;