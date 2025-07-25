import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllEvents, updateEvents } from "@/api/discountApi";
import Swal from "sweetalert2";
import DiscountEventForm from "./DiscountEventForm";

export default function EditEventPage() {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getAllEvents().then((res) => {
            const event = res.data.find((e) => String(e.id) === id);
            if (!event) return navigate("/dashboard/discount");

            setFormData({
                name: event.name,
                startDate: event.startDate.split("T")[0],
                endDate: event.endDate.split("T")[0],
                discountType: event.discountType,
                discountValue: event.discountValue,
                targetType: event.courseId ? "PRODUCT" : "ALL",
                courseId: event.courseId || "",
                note: event.note
            });
        });
    }, [id]);

    const handleSubmit = async (data) => {
        try {
            await updateEvents(id, data);
            Swal.fire("Thành công!", "Đã cập nhật sự kiện", "success");
            navigate("/dashboard/discount");
        } catch (err) {
            Swal.fire("Lỗi", "Không thể cập nhật sự kiện", "error");
        }
    };

    if (!formData) return <div>Đang tải dữ liệu...</div>;
    return <DiscountEventForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit}  isEdit={true} />
}
