import React, { useState } from "react";
import { createEvent, getCourses } from "@/api/discountApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DiscountEventForm from "./discountEventForm.jsx"

export default function CreateEventPage() {
    const [course, setCourse] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        endDate: "",
        discountType: "PERCENT",
        discountValue: "",
        targetType: "ALL",
        courseId: "",
        note: ""
    });
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            await createEvent(data); // gọi API tạo event
            Swal.fire("Thành công!", "Đã tạo sự kiện", "success");
            navigate("/dashboard/discount"); // hoặc navigate("/discount")
        } catch (err) {
            Swal.fire("Lỗi", "Không thể tạo sự kiện", "error");
        }
    };

    return(
        <DiscountEventForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
    );
}
