import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import {getOrderById} from "@/api/orderApi.js";

export function OrderItems () {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId } = location.state || {};
    const [items, setItems] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                navigate("/dashboard/orders");
                return;
            }

            try {
                const res = await getOrderById(orderId);
                setItems(res.data);
            } catch (e) {
                console.error("Lỗi khi lấy chi tiết đơn hàng:", e);
            }
        };

        fetchOrder();
    }, [orderId, navigate]);

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" className="mb-8 p-6 bg-[#4e73df]">
                    <Typography variant="h6" color="white">
                        Detail of order no #{orderId}
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                        <tr>
                            {["Title", "Price"].map((el) => (
                                <th
                                    key={el}
                                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                >
                                    <Typography
                                        variant="small"
                                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                                    >
                                        {el}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item, index) => {
                            const className = `py-3 px-5 ${
                                index === items.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                            }`;

                            return (
                                <tr key={index}>
                                    <td className={`${className}`}>
                                        <Typography className="text-sm font-semibold text-blue-gray-600">
                                            {item.course.title}
                                        </Typography>
                                    </td>
                                    <td className={`${className}`}>
                                        <Typography className="text-sm font-semibold text-blue-gray-600">
                                            {item.price.toLocaleString()} đ
                                        </Typography>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    {/* Nút quay lại */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => navigate("/dashboard/orders")}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                        >
                            ← Go back to order page
                        </button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default OrderItems;
