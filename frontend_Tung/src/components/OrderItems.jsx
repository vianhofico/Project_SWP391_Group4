import React, { useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


export const OrderItems = () => {
    const [orderItems, setOrderItems] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(!location.state || !location.state.orderItemsData){
            navigate("/order-history");
        }
    }, [location, navigate]);

    useEffect(() => {
        const items = location.state.orderItemsData;
        setOrderItems(items);
    }, []);


    return (
        <div style={{ paddingTop: '150px' }}>
            {orderItems.length === 0 ? (
                <p color="red">Không có đơn hàng nào được thực hiện</p>
            ) : (
                <div className="container py-5">
                    <h2>Chi tiết đơn hàng</h2>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            {/*<th className="align-middle">Sản phẩm</th>*/}
                            <th className="align-middle">
                                <div className="d-flex align-items-center gap-3">
                                    <div style={{ width: 80, height: 0 }}></div>
                                    <span>Sản phẩm</span>
                                </div>
                            </th>
                            <th>Giá</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderItems.map((item) => (
                            <tr key={item.id}>
                                {/*<td>*/}
                                {/*    <img*/}
                                {/*        src={`http://localhost:8080/images/product/${item.courseDTO.image}`}*/}
                                {/*        alt=""*/}
                                {/*        style={{ width: 80, height: 80, objectFit: "cover" }}*/}
                                {/*    />*/}
                                {/*</td>*/}
                                {/*<td>{item.courseDTO.title}</td>*/}
                                <td>
                                    <div className="d-flex align-items-center gap-3">
                                        <img  className="img-fluid rounded-circle" width="150"
                                              src={`http://localhost:8080/images/product/${item.courseDTO.image}`}
                                              alt=""
                                              style={{ width: 80, height: 80, objectFit: "cover" }}
                                        />
                                        <span>{item.courseDTO.title}</span>
                                    </div>
                                </td>
                                <td>{item.courseDTO.price.toLocaleString()} đ</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="mt-4 container">
                        <button className="btn-lg border border-gray-400 hover:bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-lg"
                        onClick={() => window.history.back()}>
                            Quay lại
                        </button>
                    </div>
                </div>)}
        </div>
    );
};

export default OrderItems;
