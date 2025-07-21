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

import { useEffect, useState } from "react";
import { getUserById } from "@/api/userApi.js";

export function UpdateProfile() {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        birthDate: "",
        bio: "",
        isActive: true,
        isVerified: false,
        imageUrl: ""
    });

    useEffect(() => {
        const adminData = JSON.parse(localStorage.getItem('user'));
        if (adminData) {
            setAdmin(adminData);
            setFormData({
                fullName: adminData.fullName || "",
                email: adminData.email || "",
                birthDate: adminData.birthDate || "",
                bio: adminData.bio || "",
                isActive: adminData.isActive || true,
                isVerified: adminData.isVerified || false,
                imageUrl: adminData.imageUrl || ""
            });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSwitchChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    imageUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            // const updatedUser = await updateUser(admin.id, formData);

            // localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage("Profile updated successfully!");
            setTimeout(() => {
                window.location.href = "/admin/profile";
            }, 2000);

        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage("Error updating profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!admin) return <div className="p-6">Loading...</div>;

    return (
        <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
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

                    {message && (
                        <div className={`p-4 rounded-lg mb-6 ${
                            message.includes('Error')
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Profile Image Section */}
                            <div className="lg:col-span-1">
                                <div className="text-center">
                                    <Avatar
                                        src={formData.imageUrl || "/img/default-avatar.png"}
                                        alt={formData.fullName}
                                        size="xxl"
                                        variant="rounded"
                                        className="rounded-lg shadow-lg shadow-blue-gray-500/40 mx-auto"
                                    />
                                    <div className="mt-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
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
                                            value={formData.fullName}
                                            onChange={handleInputChange}
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
                                            value={formData.email}
                                            onChange={handleInputChange}
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
                                            value={formData.birthDate}
                                            onChange={handleInputChange}
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
                                            value={formData.imageUrl}
                                            onChange={handleInputChange}
                                            placeholder="Enter image URL"
                                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                            Bio
                                        </Typography>
                                        <Textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Typography variant="small" color="blue-gray" className="font-medium">
                                            Active Status
                                        </Typography>
                                        <Switch
                                            checked={formData.isActive}
                                            onChange={(e) => handleSwitchChange('isActive', e.target.checked)}
                                            color="green"
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Typography variant="small" color="blue-gray" className="font-medium">
                                            Verified
                                        </Typography>
                                        <Switch
                                            checked={formData.isVerified}
                                            onChange={(e) => handleSwitchChange('isVerified', e.target.checked)}
                                            color="blue"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-between items-center">
                            <a href="/admin/profile">
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