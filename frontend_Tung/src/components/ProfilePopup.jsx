import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import useUserProfile from "./useUserProfile";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfileTable.css";

export const ProfilePopup = ({ show, onHide, userId, position }) => {
  const [checkChange, setCheckChange] = useState(true);
  const { user, loading, error, changePassword, updateProfile } = useUserProfile(userId, checkChange);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    imageUrl: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const popupRef = useRef(null);

  // Hàm chuyển đổi dd/mm/yyyy sang yyyy-mm-dd
  const convertDateFormat = (dateStr) => {
    if (!dateStr) return "";
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // Đồng bộ formData với user khi user thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        birthDate: convertDateFormat(user.birthDate) || "",
        imageUrl: user.imageUrl || "",
      });
      setPasswordData({
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onHide();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Restore body scroll when popup is closed
      document.body.style.overflow = 'unset';
    };
  }, [show, onHide]);

  const handleChangePassword = async () => {
    const result = await changePassword(userId, passwordData);
    if (result.success) {
      toast.success(result.message);
      setCheckChange(!checkChange);
      setShowPasswordForm(false);
      setPasswordData({ oldPassword: "", newPassword: "" });
    } else {
      toast.error(result.message);
    }
  };

  const handleUpdate = async () => {
    const result = await updateProfile(userId, formData);
    if (result.success) {
      setCheckChange(!checkChange);
      toast.success(result.message);
      setShowUpdateForm(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  if (!show) return null;

  // Center popup overlay
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1050,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const popupStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    padding: '0',
    overflow: 'hidden',
    animation: 'popupFadeIn 0.3s ease-out',
  };

  if (loading) {
    return (
      <div style={overlayStyle}>
        <div ref={popupRef} style={popupStyle}>
          <div className="p-5 text-center">
            <Spinner animation="border" role="status" size="lg">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 mb-0 fs-5">Đang tải thông tin người dùng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={overlayStyle}>
        <div ref={popupRef} style={popupStyle}>
          <div className="p-5 text-center">
            <Alert variant="warning" className="mb-0 fs-5">
              Không tìm thấy thông tin người dùng
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <div ref={popupRef} style={popupStyle}>
        {!showUpdateForm && !showPasswordForm ? (
          // Main Profile View
          <div>
            <div style={{ 
              background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)', 
              color: 'white', 
              padding: '25px 30px', 
              borderRadius: '12px 12px 0 0',
              position: 'relative'
            }}>
              <h4 className="mb-0 fw-bold">User Profile Management</h4>
              <button 
                onClick={onHide}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
            
            <div className="p-5">
              <div className="text-center mb-5">
                <img
                  src={user.imageUrl || "https://cdnphoto.dantri.com.vn/Au8icunjIdjAao2SrF0OZWJkRO8=/thumb_w/1360/2025/05/26/jack1-1748272770861.jpg"}
                  alt={user.fullName}
                  className="rounded-circle mb-4"
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    objectFit: 'cover',
                    border: '4px solid #4e73df',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
                <h3 className="mb-2 fw-bold">{user.fullName}</h3>
                <p className="text-muted fs-5 mb-0">{user.email}</p>
              </div>

              <div className="table-container" style={{ maxWidth: '100%', margin: '0 auto' }}>
                <table className="profile-table">
                  <thead>
                    <tr>
                      <th style={{ fontSize: '1rem', padding: '15px 20px' }}>User Information</th>
                      <th style={{ fontSize: '1rem', padding: '15px 20px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontSize: '1rem', padding: '15px 20px' }}>Vai trò</td>
                      <td style={{ fontSize: '1rem', padding: '15px 20px' }}>
                        <span className="fw-bold">{user.role}</span> {user.reportCount && `(Reports: ${user.reportCount})`}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: '1rem', padding: '15px 20px' }}>Trạng thái</td>
                      <td style={{ fontSize: '1rem', padding: '15px 20px' }}>
                        <span className={`badge fs-6 ${user.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                          {user.status === "Active" ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: '1rem', padding: '15px 20px' }}>Ngày sinh</td>
                      <td style={{ fontSize: '1rem', padding: '15px 20px' }}>{user.birthDate}</td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: '1rem', padding: '15px 20px' }}>Ngày tạo</td>
                      <td style={{ fontSize: '1rem', padding: '15px 20px' }}>{user.createdAt}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-5">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowPasswordForm(true)}
                  style={{ minWidth: '150px' }}
                >
                  Change Password
                </Button>
                <Button
                  variant="warning"
                  size="lg"
                  onClick={() => setShowUpdateForm(true)}
                  style={{ minWidth: '150px' }}
                >
                  Update Data
                </Button>
              </div>
            </div>
          </div>
        ) : showUpdateForm ? (
          // Update Profile Form
          <div>
            <div style={{ 
              background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)', 
              color: 'black', 
              padding: '25px 30px', 
              borderRadius: '12px 12px 0 0',
              position: 'relative'
            }}>
              <h4 className="mb-0 fw-bold">Cập nhật thông tin người dùng</h4>
              <button 
                onClick={() => setShowUpdateForm(false)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'black',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
            
            <div className="p-5">
              <Form>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold fs-5">Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    size="lg"
                    className="py-3"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold fs-5">Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    size="lg"
                    className="py-3"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold fs-5">URL ảnh đại diện</Form.Label>
                  <Form.Control
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    size="lg"
                    className="py-3"
                  />
                </Form.Group>
              </Form>
              
              <div className="d-flex justify-content-end gap-3">
                <Button variant="secondary" size="lg" onClick={() => setShowUpdateForm(false)}>
                  Hủy
                </Button>
                <Button variant="success" size="lg" onClick={handleUpdate}>
                  Cập nhật
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Change Password Form
          <div>
            <div style={{ 
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', 
              color: 'white', 
              padding: '25px 30px', 
              borderRadius: '12px 12px 0 0',
              position: 'relative'
            }}>
              <h4 className="mb-0 fw-bold">Thay đổi mật khẩu</h4>
              <button 
                onClick={() => setShowPasswordForm(false)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
            
            <div className="p-5">
              <Form>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold fs-5">Mật khẩu cũ</Form.Label>
                  <Form.Control
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    size="lg"
                    className="py-3"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold fs-5">Mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    size="lg"
                    className="py-3"
                  />
                </Form.Group>
              </Form>
              
              <div className="d-flex justify-content-end gap-3">
                <Button variant="secondary" size="lg" onClick={() => setShowPasswordForm(false)}>
                  Hủy
                </Button>
                <Button variant="success" size="lg" onClick={handleChangePassword}>
                  Cập nhật
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePopup; 