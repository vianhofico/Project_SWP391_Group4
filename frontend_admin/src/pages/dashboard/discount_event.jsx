import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import {getAllEvents, deleteEvents} from "@/api/discountApi.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function DiscountEventManager() {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await getAllEvents();
            setEvents(res.data);
        } catch (error) {
            console.error("Lỗi khi tải sự kiện:", error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Xác nhận xoá sự kiện?',
            text: 'Bạn sẽ không thể khôi phục lại dữ liệu đã xoá!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý xoá',
            cancelButtonText: 'Huỷ bỏ',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            reverseButtons: true,
            customClass: {
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            },
            didOpen: () => {
                const confirmBtn = document.querySelector('.my-confirm-btn');
                const cancelBtn = document.querySelector('.my-cancel-btn');

                if (confirmBtn) {
                    confirmBtn.style.backgroundColor = '#d33';
                    confirmBtn.style.color = 'white';
                    confirmBtn.style.padding = '8px 16px';
                    confirmBtn.style.borderRadius = '4px';
                    confirmBtn.style.opacity = '1';
                    confirmBtn.style.visibility = 'visible';
                }

                if (cancelBtn) {
                    cancelBtn.style.backgroundColor = '#3085d6';
                    cancelBtn.style.color = 'white';
                    cancelBtn.style.padding = '8px 16px';
                    cancelBtn.style.borderRadius = '4px';
                    cancelBtn.style.opacity = '1';
                    cancelBtn.style.visibility = 'visible';
                }
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteEvents(id);
                await Swal.fire('Đã xoá!', 'Sự kiện đã được xoá thành công.', 'success');
                fetchEvents();
            } catch (error) {
                console.error(error);
                Swal.fire('Lỗi!', 'Không thể xoá sự kiện. Vui lòng thử lại.', 'error');
            }
        }
    };

    const currentEvents = events.slice(page * pageSize, (page + 1) * pageSize);
    const totalPages = Math.ceil(events.length / pageSize);

    return (
        <Card className="mt-8">
            <CardHeader variant="gradient" className="mb-8 p-6 bg-[#4e73df]">
                <Typography variant="h6" color="white">Discount Events</Typography>
            </CardHeader>

            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <div className="flex justify-end px-6 mb-4">
                    <button
                        type="button"   // 👈 THÊM DÒNG NÀY
                        onClick={() => navigate("/dashboard/discount/create")}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        + Create Discount Event
                    </button>

                </div>

                <table className="w-full min-w-[1000px] table-auto">
                    <thead>
                    <tr>
                        {["Event Name", "Start Date", "End Date", "Type", "Value", "Course", "Target Type", "Actions"].map((header) => (
                            <th key={header} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">{header}</Typography>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {currentEvents.map((event, index) => {
                        const className = `py-3 px-5 ${index === events.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                        return (
                            <tr key={event.id}>
                                <td className={className}><Typography className="text-sm font-semibold text-blue-gray-600">{event.name}</Typography></td>
                                <td className={className}>
                                    <Typography className="text-sm font-semibold text-blue-gray-600">
                                        {event.startDate ? dayjs(event.startDate).format("DD/MM/YYYY") : ""}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-sm font-semibold text-blue-gray-600">
                                        {event.endDate ? dayjs(event.endDate).format("DD/MM/YYYY") : ""}
                                    </Typography>
                                </td>
                                <td className={className}><Typography className="text-sm font-semibold text-blue-gray-600">{event.discountType}</Typography></td>
                                <td className={className}><Typography className="text-sm font-semibold text-blue-gray-600">{event.discountValue}</Typography></td>
                                <td className={className}>
                                    <Typography className="text-sm font-semibold text-blue-gray-600">
                                        {event.courseId ? `ID: ${event.courseId} - ${event.courseName}` : "N/A"}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-sm font-semibold text-blue-gray-600 uppercase">
                                        {event.targetType || (event.courseId ? "PRODUCT" : "ALL")}
                                    </Typography>
                                </td>
                                <td className="py-3 px-5">
                                    <button type="button"
                                            onClick={() => navigate(`/dashboard/discount/edit/${event.id}`)}
                                            className="text-xs font-semibold text-yellow-700 border border-yellow-500 px-2 py-1 rounded mr-2 hover:bg-yellow-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="text-xs font-semibold text-red-700 border border-red-500 px-2 py-1 rounded hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                <div className="flex justify-center items-center gap-4 mt-4">
                    <button onClick={() => setPage(page > 0 ? page - 1 : 0)} className="px-3 py-1 rounded text-blue-600 bg-white text-sm font-semibold hover:bg-blue-700 hover:text-white">Prev</button>
                    <button className="px-4 py-1 rounded bg-blue-800 text-white text-sm font-semibold cursor-default">
                        {totalPages > 0 ? `${page + 1}/${totalPages}` : '0/0'}
                    </button>
                    <button onClick={() => setPage(page + 1 < totalPages ? page + 1 : page)} className="px-3 py-1 rounded text-blue-600 bg-white text-sm font-semibold hover:bg-blue-700 hover:text-white">Next</button>
                </div>
            </CardBody>
        </Card>
    );
}
