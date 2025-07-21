import {
    Card,
    CardBody,
    Avatar,
    Typography,
} from "@material-tailwind/react";

import {useEffect, useState} from "react";
import {getUserById} from "@/api/userApi.js";

export function Profile() {

    const admin = JSON.parse(localStorage.getItem('user'));

    if (!admin) return <div className="p-6">Loading...</div>;

    return (
        <>
            <div
                className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/75"/>
            </div>

            <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
                <CardBody className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar
                            src={admin.imageUrl || "/img/default-avatar.png"}
                            alt={admin.fullName}
                            size="xl"
                            variant="rounded"
                            className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                        />
                        <div className="text-center md:text-left">
                            <Typography variant="h5" color="blue-gray" className="mb-1">
                                {admin.fullName}
                            </Typography>
                            <Typography variant="small" className="font-normal text-blue-gray-600">
                                {admin.role}
                            </Typography>
                            <Typography variant="paragraph" className="text-sm text-gray-700 mt-2">
                                {admin.bio || "No bio provided."}
                            </Typography>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                        <div>
                            <Typography className="text-sm text-gray-500">Email</Typography>
                            <Typography className="font-medium text-gray-800">{admin.email}</Typography>
                        </div>
                        <div>
                            <Typography className="text-sm text-gray-500">Birth Date</Typography>
                            <Typography className="font-medium text-gray-800">{admin.birthDate}</Typography>
                        </div>
                        <div>
                            <Typography className="text-sm text-gray-500">Joined</Typography>
                            <Typography className="font-medium text-gray-800">{admin.createdAt}</Typography>
                        </div>
                        <div>
                            <Typography className="text-sm text-gray-500">Active</Typography>
                            <Typography
                                className="font-medium text-gray-800">{admin.isActive ? "Yes" : "No"}</Typography>
                        </div>
                        <div>
                            <Typography className="text-sm text-gray-500">Verified</Typography>
                            <Typography
                                className="font-medium text-gray-800">{admin.isVerified ? "Yes" : "No"}</Typography>
                        </div>
                    </div>
                    <div className="mt-10 flex justify-end">
                        <a href="/dashboard/update-profile">
                            <button
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
                                Update Profile
                            </button>
                        </a>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}

export default Profile;
