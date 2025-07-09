import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AccountSettings = () => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState("profile");
    const [previewAvatar, setPreviewAvatar] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        birthday: "",
        gender: "",
        description: "",
        job: "",
        facebook: "",
        youtube: "",
        avatar: null,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8080/api/users/account/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = res.data;
                setFormData(prev => ({
                    ...prev,
                    name: data.fullName || "",
                    birthday: data.birthDate || "",
                    // ...data,
                    avatar: null
                }));
                if (data.avatarUrl) setPreviewAvatar(data.avatarUrl);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin:", error);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, avatar: files[0] });
            setPreviewAvatar(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleDeleteAvatar = () => {
        setFormData({ ...formData, avatar: null });
        setPreviewAvatar(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const form = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) form.append(key, formData[key]);
            }

            await axios.put("http://localhost:8080/api/users/account/profile", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Cập nhật thành công");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Cập nhật thất bại");
        }
    };

    return (
        <div className="container mt-5 pt-4" style={{ maxWidth: "900px" }}>
            <h4 className="mb-4 fw-bold">Cài đặt</h4>
            <div className="mb-4 border-bottom">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${selectedTab === "profile" ? "active" : ""}`}
                            onClick={() => setSelectedTab("profile")}
                        >
                            Chỉnh sửa hồ sơ
                        </button>
                    </li>
                </ul>
            </div>

            {selectedTab === "profile" && (
                <form onSubmit={handleSubmit} className="d-flex flex-wrap">
                    <div className="me-4 mb-4 text-center" style={{ width: "180px" }}>
                        {previewAvatar ? (
                            <img src={previewAvatar} alt="Avatar" className="rounded-circle mb-2" style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                        ) : (
                            <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "120px", height: "120px", fontSize: "48px" }}>
                                {formData.name?.charAt(0)?.toUpperCase() || "T"}
                            </div>
                        )}
                        <input type="file" name="avatar" onChange={handleChange} className="form-control form-control-sm mb-2" />
                        <button type="button" onClick={handleDeleteAvatar} className="btn btn-sm btn-outline-danger w-100">
                            <i className="bi bi-trash"></i> Xoá
                        </button>
                    </div>

                    <div className="flex-grow-1">
                        {/* Các trường nhập liệu */}
                        {[
                            ["Tên", "name", true],
                            ["Địa chỉ", "address"],
                            ["Số điện thoại", "phone"],
                            ["Ngày sinh", "birthday", false, "date"],
                            ["Mô tả", "description", false, "textarea"],
                            ["Job name", "job"]
                        ].map(([label, name, required, type = "text"]) => (
                            <div className="mb-2" key={name}>
                                <label className="form-label">
                                    {label} {required && <span className="text-danger">*</span>}
                                </label>
                                {type === "textarea" ? (
                                    <textarea name={name} value={formData[name]} onChange={handleChange} className="form-control" />
                                ) : (
                                    <input type={type} name={name} value={formData[name]} onChange={handleChange} className="form-control" required={required} />
                                )}
                            </div>
                        ))}

                        <div className="mb-2">
                            <label className="form-label">Giới tính</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                                <option value="">Chọn giới tính</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                            </select>
                        </div>

                        {/* Social */}
                        {[
                            ["Facebook", "facebook", "https://facebook.com/"],
                            ["Youtube", "youtube", "https://youtube.com/"]
                        ].map(([label, name, prefix]) => (
                            <div className="mb-2" key={name}>
                                <label className="form-label">{label}</label>
                                <div className="input-group">
                                    <span className="input-group-text">{prefix}</span>
                                    <input type="text" name={name} value={formData[name]} onChange={handleChange} className="form-control" />
                                </div>
                            </div>
                        ))}

                        <button type="submit" className="btn btn-primary mt-3">Lưu chỉnh sửa</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AccountSettings;
