import React, { useEffect, useState } from "react";
import { getCourses } from "@/api/discountApi.js";
import { useNavigate } from "react-router-dom";

export default function DiscountEventForm({ formData, setFormData, handleSubmit, isEdit = false }) {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await getCourses();
            setCourses(res.data);
        } catch (err) {
            console.error("Failed to fetch courses", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "targetType") {
            setFormData((prev) => ({
                ...prev,
                targetType: value,
                courseId: value === "ALL" ? "" : prev.courseId,
            }));
        } else if (name === "discountValue") {
            setFormData((prev) => ({
                ...prev,
                discountValue: value === "" ? "" : Number(value),
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            ...formData,
            discountValue: formData.discountValue === "" ? null : Number(formData.discountValue),
        };

        if (submitData.targetType === "ALL") {
            delete submitData.courseId;
        }

        handleSubmit(submitData);
    };

    const navigate = useNavigate();


    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-6 rounded mx-6 mb-6"
        >
            <div className="md:col-span-2 text-lg font-semibold text-gray-700 mb-2">
                {isEdit ? "Edit Discount Event" : "Create New Discount Event"}
            </div>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 rounded w-full" required />
            </div>

            <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="border p-2 rounded w-full" required />
            </div>

            <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="border p-2 rounded w-full" required />
            </div>

            <div>
                <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                <select name="discountType" value={formData.discountType} onChange={handleChange} className="border p-2 rounded w-full">
                    <option value="PERCENT">%</option>
                    <option value="AMOUNT">VND</option>
                </select>
            </div>

            <div>
                <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                    min={1}
                />
            </div>

            <div>
                <label htmlFor="targetType" className="block text-sm font-medium text-gray-700 mb-1">Target Type</label>
                <select name="targetType" value={formData.targetType} onChange={handleChange} className="border p-2 rounded w-full">
                    <option value="ALL">All Courses</option>
                    <option value="PRODUCT">Specific Course</option>
                </select>
            </div>

            {formData.targetType === "PRODUCT" && (
                <div>
                    <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                    <select name="courseId" value={formData.courseId} onChange={handleChange} className="border p-2 rounded w-full" required>
                        <option value="">-- Select Course --</option>
                        {courses.map((course) => (
                            <option key={course.courseId} value={course.courseId}>
                                {course.courseId} - {course.title}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="col-span-full flex justify-end gap-4">
                <button
                    type="button"
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/dashboard/discount")}
                >
                    Back
                </button>

                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    {isEdit ? "Update Event" : "Create Event"}
                </button>
            </div>
        </form>
    );
}

