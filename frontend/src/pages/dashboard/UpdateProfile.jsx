import {
    Card,
    CardBody,
    Avatar,
    Typography,
    Input,
    Textarea,
    Button,
    Switch,
} from "@material-tailwind/react";

import {useEffect, useState} from "react";
import {updateAdminProfile} from "@/api/userApi.js";

export function UpdateProfile() {

    const admin = JSON.parse(localStorage.getItem("user"));
    const [fullName, setFullName] = useState(admin.fullName);
    const [email, setEmail] = useState(admin.email);
    const [birthDate, setBirthDate] = useState(admin.birthDate);
    const [imageUrl, setImageUrl] = useState(admin.imageUrl);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [updatedAdmin, setUpdateAdmin] = useState({});

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // Lưu file để gửi lên backend

            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result); // Hiển thị ảnh trước khi upload
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("birthDate", birthDate);
        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            const res = await updateAdminProfile(formData);
            setUpdateAdmin(res);
            setLoading(false);
            localStorage.setItem("user", JSON.stringify(updatedAdmin));
            alert("Cập nhật thành công!");
        } catch (error) {
            console.error("Error updating profile", error);
            setLoading(false);
            alert("Cập nhật thất bại!");
        }
    };
    function convertToISODate(dateStr) {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return (
        <>
            <div
                className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/75"/>
            </div>

            <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
                <CardBody className="p-6">
                    <div className="mb-6">
                        <Typography variant="h4" color="blue-gray" className="mb-2">
                            Update Profile
                        </Typography>
                        <Typography variant="paragraph" className="text-blue-gray-600">
                            Update your personal information and preferences
                        </Typography>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Profile Image Section */}
                            <div className="lg:col-span-1">
                                <div className="text-center">
                                    <Avatar
                                        src={imageUrl || "/img/default-avatar.png"}
                                        alt={fullName}
                                        size="xxl"
                                        variant="rounded"
                                        className="rounded-lg shadow-lg shadow-blue-gray-500/40 mx-auto"
                                    />
                                    <div className="mt-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e)}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                                        >
                                            Change Photo
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields Section */}
                            <div className="lg:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                            Full Name *
                                        </Typography>
                                        <Input
                                            name="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                            Email *
                                        </Typography>
                                        <Input
                                            type="email"
                                            name="email"
                                            readOnly={true}
                                            value={email}
                                            required
                                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                            Birth Date
                                        </Typography>
                                        <Input
                                            type="date"
                                            name="birthDate"
                                            value={convertToISODate(birthDate)}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                            Image URL
                                        </Typography>
                                        <Input
                                            name="imageUrl"
                                            value={imageUrl}
                                            onChange={(e) => handleImageUpload(e)}
                                            readOnly={true}
                                            placeholder="Enter image URL"
                                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-between items-center">
                            <a href="/dashboard/profile">
                                <Button variant="outlined" color="gray">
                                    Cancel
                                </Button>
                            </a>
                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    color="purple"
                                    loading={loading}
                                    disabled={loading}
                                >
                                    {loading ? "Updating..." : "Update Profile"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </>
    );
}

export default UpdateProfile;