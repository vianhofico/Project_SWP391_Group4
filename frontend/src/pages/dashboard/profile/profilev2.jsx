import {
  Card,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  CardHeader,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserProfile from "./useUserProfile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfileTable.css";

export function ProfileV2() {
  const [checkChange, setCheckChange] = useState(true);
  const { user, loading, error, refetch, changePassword, removeUser, updateProfile } = useUserProfile(13, checkChange);
  const navigate = useNavigate();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Huy",
    birthDate: "2005-06-19",
    imageUrl: "https://example.com/new-avatar.jpg",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "abc12345",
    newPassword: "newPass123",
  });

  // Hàm chuyển đổi dd/mm/yyyy sang yyyy-mm-dd
  const convertDateFormat = (dateStr) => {
    if (!dateStr) return "";
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr; // Trả về nguyên gốc nếu không đúng định dạng
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };


  // Đồng bộ formData với user khi user thay đổi
  useEffect(() => {
    debugger;
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "Huy",
        birthDate: convertDateFormat(user.birthDate) || "2005-06-19",
        imageUrl: user.imageUrl || "https://example.com/new-avatar.jpg",
      }));
      setPasswordData((prev) => ({
        ...prev,
        oldPassword: user.password,
        newPassword: "",
      }))
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChangePassword = async (userId) => {
    const result = await changePassword(userId, passwordData);
    if (result.success) {
      toast.success(result.message);
      setCheckChange(!checkChange); // Trigger re-fetch
      setOpenPasswordModal(false);
      setPasswordData({ oldPassword: "", newPassword: "" }); // Reset form
    } else {
      toast.error(result.message);
    }
  };

  const handleRemoveUser = async (userId, fullName) => {
    if (!window.confirm(`Do you confirm remove user ${fullName}?`)) return;

    const result = await removeUser(userId);
    if (result.success) {
      setCheckChange(!checkChange); // Trigger re-fetch
      toast.success(result.message);
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  const handleOpenUpdateModal = () => {
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleOpenPasswordModal = () => {
    setOpenPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const result = await updateProfile(13, formData);
    if (result.success) {
      setCheckChange(!checkChange); // Trigger re-fetch
      toast.success(result.message);
      handleCloseUpdateModal();
    } else {
      toast.error(result.message);
    }
  };

  if (loading) {
    return <Typography className="text-center mt-12">Đang tải...</Typography>;
  }

  if (!user) {
    return <Typography className="text-center mt-12">Không tìm thấy thông tin người dùng</Typography>;
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" className="mb-8 p-6 bg-[#4e73df]">
          <Typography variant="h6" color="white">User Profile</Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          <div className="flex flex-col items-center p-6">
            <Avatar
              src={user.imageUrl || "https://cdnphoto.dantri.com.vn/Au8icunjIdjAao2SrF0OZWJkRO8=/thumb_w/1360/2025/05/26/jack1-1748272770861.jpg"}
              alt={user.fullName}
              size="xxl"
              variant="circular"
              className="mb-4"
            />
            <Typography variant="h4" color="blue-gray" className="mb-2">
              {user.fullName}
            </Typography>
            <Typography variant="small" color="blue-gray" className="mb-4">
              {user.email}
            </Typography>
            <div className="table-container">
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>User Data</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Vai trò</td>
                    <td>
                      {user.role} (Reports: {user.reportCount})
                    </td>
                  </tr>
                  <tr>
                    <td>Trạng thái</td>
                    <td>
                      <Chip
                        variant="gradient"
                        color={user.status === "Active" ? "green" : "blue-gray"}
                        value={user.status === "Active" ? "ACTIVE" : "INACTIVE"}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Ngày sinh</td>
                    <td>{user.birthDate}</td>
                  </tr>
                  <tr>
                    <td>Ngày tạo</td>
                    <td>{user.createdAt}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex space-x-4 mt-6">
              <Button
                onClick={handleOpenPasswordModal}
                color="blue"
                size="sm"
              >
                Change Password
              </Button>
              <Button
                onClick={() => handleRemoveUser(user.userId, user.fullName)}
                color="red"
                size="sm"
              >
                Remove User
              </Button>
              <Button
                onClick={handleOpenUpdateModal}
                color="yellow"
                size="sm"
              >
                Update Data
              </Button>
              <Link to={`/dashboard/users/${user.userId}/posts`}>
                <Button color="blue-gray" size="sm">
                  View Detail
                </Button>
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Modal cập nhật thông tin */}
      <Dialog open={openUpdateModal} handler={handleOpenUpdateModal} size="sm">
        <DialogHeader>Cập nhật thông tin người dùng</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              size="lg"
            />
            <Input
              label="Ngày sinh (mm/dd/yyyy)"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              size="lg"
            />
            <Input
              label="URL ảnh đại diện"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              size="lg"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleCloseUpdateModal}
            className="mr-2"
          >
            Hủy
          </Button>
          <Button
            color="green"
            onClick={handleUpdate}
          >
            Cập nhật
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal thay đổi mật khẩu */}
      <Dialog open={openPasswordModal} handler={handleOpenPasswordModal} size="sm">
        <DialogHeader>Thay đổi mật khẩu</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Mật khẩu cũ"
              name="oldPassword"
              type="password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              size="lg"
            />
            <Input
              label="Mật khẩu mới"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              size="lg"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleClosePasswordModal}
            className="mr-2"
          >
            Hủy
          </Button>
          <Button
            color="green"
            onClick={() => handleChangePassword(13)} // userId = 4 cho API POST
          >
            Cập nhật
          </Button>
        </DialogFooter>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default ProfileV2;