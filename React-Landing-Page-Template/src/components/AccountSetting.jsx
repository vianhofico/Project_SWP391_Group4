// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
//
// const AccountSettings = () => {
//     const navigate = useNavigate();
//     const [selectedTab, setSelectedTab] = useState("profile");
//     const [previewAvatar, setPreviewAvatar] = useState(null);
//
//     const [formData, setFormData] = useState({
//         name: "",
//         address: "",
//         phone: "",
//         birthday: "",
//         gender: "",
//         description: "",
//         job: "",
//         facebook: "",
//         youtube: "",
//         avatar: null,
//     });
//
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const res = await axios.get("http://localhost:8080/api/users/account/profile", {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 const data = res.data;
//                 setFormData(prev => ({
//                     ...prev,
//                     name: data.fullName || "",
//                     birthday: data.birthDate || "",
//                     // ...data,
//                     avatar: null
//                 }));
//                 if (data.avatarUrl) setPreviewAvatar(data.avatarUrl);
//             } catch (error) {
//                 console.error("Lỗi khi lấy thông tin:", error);
//             }
//         };
//         fetchUser();
//     }, []);
//
//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//         if (files) {
//             setFormData({ ...formData, avatar: files[0] });
//             setPreviewAvatar(URL.createObjectURL(files[0]));
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };
//
//     const handleDeleteAvatar = () => {
//         setFormData({ ...formData, avatar: null });
//         setPreviewAvatar(null);
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const token = localStorage.getItem("token");
//             const form = new FormData();
//             for (const key in formData) {
//                 if (formData[key] !== null) form.append(key, formData[key]);
//             }
//
//             await axios.put("http://localhost:8080/api/users/account/profile", form, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "multipart/form-data"
//                 }
//             });
//
//             alert("Cập nhật thành công");
//         } catch (error) {
//             console.error("Lỗi khi cập nhật:", error);
//             alert("Cập nhật thất bại");
//         }
//     };
//
//     return (
//         <div className="container mt-5 pt-4" style={{ maxWidth: "900px" }}>
//             <h4 className="mb-4 fw-bold">Cài đặt</h4>
//             <div className="mb-4 border-bottom">
//                 <ul className="nav nav-tabs">
//                     <li className="nav-item">
//                         <button
//                             className={`nav-link ${selectedTab === "profile" ? "active" : ""}`}
//                             onClick={() => setSelectedTab("profile")}
//                         >
//                             Chỉnh sửa hồ sơ
//                         </button>
//                     </li>
//                 </ul>
//             </div>
//
//             {selectedTab === "profile" && (
//                 <form onSubmit={handleSubmit} className="d-flex flex-wrap">
//                     <div className="me-4 mb-4 text-center" style={{ width: "180px" }}>
//                         {previewAvatar ? (
//                             <img src={previewAvatar} alt="Avatar" className="rounded-circle mb-2" style={{ width: "120px", height: "120px", objectFit: "cover" }} />
//                         ) : (
//                             <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "120px", height: "120px", fontSize: "48px" }}>
//                                 {formData.name?.charAt(0)?.toUpperCase() || "T"}
//                             </div>
//                         )}
//                         <input type="file" name="avatar" onChange={handleChange} className="form-control form-control-sm mb-2" />
//                         <button type="button" onClick={handleDeleteAvatar} className="btn btn-sm btn-outline-danger w-100">
//                             <i className="bi bi-trash"></i> Xoá
//                         </button>
//                     </div>
//
//                     <div className="flex-grow-1">
//                         {/* Các trường nhập liệu */}
//                         {[
//                             ["Tên", "name", true],
//                             ["Địa chỉ", "address"],
//                             ["Số điện thoại", "phone"],
//                             ["Ngày sinh", "birthday", false, "date"],
//                             ["Mô tả", "description", false, "textarea"],
//                             ["Job name", "job"]
//                         ].map(([label, name, required, type = "text"]) => (
//                             <div className="mb-2" key={name}>
//                                 <label className="form-label">
//                                     {label} {required && <span className="text-danger">*</span>}
//                                 </label>
//                                 {type === "textarea" ? (
//                                     <textarea name={name} value={formData[name]} onChange={handleChange} className="form-control" />
//                                 ) : (
//                                     <input type={type} name={name} value={formData[name]} onChange={handleChange} className="form-control" required={required} />
//                                 )}
//                             </div>
//                         ))}
//
//                         <div className="mb-2">
//                             <label className="form-label">Giới tính</label>
//                             <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
//                                 <option value="">Chọn giới tính</option>
//                                 <option value="male">Nam</option>
//                                 <option value="female">Nữ</option>
//                             </select>
//                         </div>
//
//                         {/* Social */}
//                         {[
//                             ["Facebook", "facebook", "https://facebook.com/"],
//                             ["Youtube", "youtube", "https://youtube.com/"]
//                         ].map(([label, name, prefix]) => (
//                             <div className="mb-2" key={name}>
//                                 <label className="form-label">{label}</label>
//                                 <div className="input-group">
//                                     <span className="input-group-text">{prefix}</span>
//                                     <input type="text" name={name} value={formData[name]} onChange={handleChange} className="form-control" />
//                                 </div>
//                             </div>
//                         ))}
//
//                         <button type="submit" className="btn btn-primary mt-3">Lưu chỉnh sửa</button>
//                     </div>
//                 </form>
//             )}
//         </div>
//     );
// };
//
// export default AccountSettings;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AccountSettings = () => {
    const navigate = useNavigate();
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [role, setRole] = useState("Student");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        displayName: "",
        avatar: null,
        newPassword: "",
        confirmPassword: ""
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
                const [firstName, ...lastParts] = (data.fullName || "").split(" ");
                const lastName = lastParts.join(" ");
                setFormData(prev => ({
                    ...prev,
                    firstName: firstName || "",
                    lastName: lastName || "",
                    displayName: data.fullName || ""
                }));
                if (data.avatarUrl) setPreviewAvatar(data.avatarUrl);
                setRole(data.role || "Student");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const form = new FormData();
            for (const key in formData) {
                if (formData[key]) {
                    form.append(key, formData[key]);
                }
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("logout"));
        navigate("/");
    };

    return (
        <div className="container mt-5 pt-4" style={{ maxWidth: "800px" }}>
            <h3 className="fw-bold mb-4">My profile</h3>

            {/* Avatar + tên + vai trò */}
            <div className="text-center mb-4">
                {previewAvatar ? (
                    <img src={previewAvatar} alt="Avatar" className="rounded-circle" style={{ width: "140px", height: "140px", objectFit: "cover" }} />
                ) : (
                    <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto"
                         style={{ width: "140px", height: "140px", fontSize: "60px" }}>
                        {formData.firstName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                )}
                <h5 className="mt-3 mb-1">{formData.firstName} {formData.lastName}</h5>
                <p className="text-muted">{role}</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Thông tin tên */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Last Name</label>
                        <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                </div>

                {/* Tên hiển thị */}
                <div className="mb-4">
                    <label className="form-label">Display name publicly as:</label>
                    <select className="form-select" name="displayName" value={formData.displayName} onChange={handleChange}>
                        <option value={`${formData.firstName} ${formData.lastName}`}>{formData.firstName} {formData.lastName}</option>
                        <option value={formData.firstName}>{formData.firstName}</option>
                        <option value={formData.lastName}>{formData.lastName}</option>
                    </select>
                    <small className="text-muted">
                        The display name is shown in all public fields, such as the author name, instructor name, student name.
                    </small>
                </div>

                {/* Đổi mật khẩu */}
                <h5 className="fw-bold mt-5 mb-3">Change Password</h5>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">New Password</label>
                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Re-type New Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control" />
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4">
                    <button type="submit" className="btn btn-primary px-4">Save Changes</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={handleLogout}>
                        <i className="bi bi-power"></i> Log out
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountSettings;
