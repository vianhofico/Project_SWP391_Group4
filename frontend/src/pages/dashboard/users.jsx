import {
    Card,
    CardBody,
    Typography,
    Avatar,
    Chip,
    CardHeader, Alert,

} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {addAdmin, getAllUsers, resetPassword} from "@/api/userApi.js";

export function Users() {

    const [userList, setUserList] = useState([]);
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [fullName, setFullName] = useState("");
    const [status, setStatus] = useState("");
    const [checkChange, setCheckChange] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const {userRole} = useParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [addAdminEmail, setAddAdminEmail] = useState("");


    useEffect(() => {
        if (!["learner", "admin"].includes(userRole)) {
            navigate("/dashboard/users/learner", {replace: true});
        }
    }, [userRole]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getAllUsers(
                    {
                        role: userRole,
                        status,
                        fullName,
                        sortField,
                        sortOrder,
                        page,
                        size
                    });
                setUserList(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.log("UserList mới:", userList);
                console.log("TotalPages: ", totalPages);
                console.error("Lỗi khi fetch users:", err);
            }
        };
        fetchUsers();
    }, [page, status, fullName, sortField, sortOrder, checkChange, userRole]);

    useEffect(() => {
        console.log("UserList mới:", userList);
        console.log("TotalPages: ", totalPages);
    }, [userList]);

    const handleResetPassword = async (email) => {
        const confirmText = "Do you confirm to reset password?";

        if (!window.confirm(confirmText)) return;

        try {
            await resetPassword(email);
            setCheckChange(!checkChange);
            alert("Reset successfully!");
        } catch (error) {
            console.error(error);
            alert("Error when reset password!");
        }
    };

    const handleAddAdmin = async (email) => {
        try {
            await addAdmin(email);
            setShowModal(false);
            setCheckChange(!checkChange);
            alert("Add successfully!");
        } catch (error) {
            console.error(error);
            alert("Error when adding admin");
        }
    };


    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <div className="flex gap-4 px-4">
                {["learner", "admin"].map((role) => (
                    <button
                        key={role}
                        onClick={() => {
                            setPage(0);
                            navigate(`/dashboard/users/${role}`);
                        }}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 ${
                            userRole === role
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-blue-600"
                        }`}
                    >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap items-end gap-4 px-4">
                {/* Input Search */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Search</label>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                </div>

                {/* Select Status */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    >
                        <option value="">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {/* Sort Field */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Sort By</label>
                    <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                    >
                        <option value="">None</option>
                        <option value="fullName">Full Name</option>
                        <option value="birthDate">Birth Date</option>
                        <option value="reportCount">Number of reports</option>
                    </select>
                </div>

                {/* Sort Order */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Order</label>
                    <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="">None</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

                {/* Add Admin button aligned to right */}
                {userRole === "admin" && (
                    <div className="ml-auto">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                            Add Admin
                        </button>
                    </div>
                )}
            </div>

            <Card>
                <CardHeader variant="gradient" className="mb-8 p-6 bg-[#4e73df]">
                    <Typography variant="h6" color="white">{userRole.toUpperCase()} Table</Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 ">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                        <tr>
                            {["FULLNAME", userRole === "admin" ? "CREATED AT" : "REPORT COUNT", "BIRTHDATE", "STATUS", "ACTION"].map((el) => (
                                <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                    <Typography
                                        variant="small"
                                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                                    >
                                        {el}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {userList.map((user, index) => {
                            const className = `py-3 px-5 ${
                                index === userList.length - 1 ? "" : "border-b border-blue-gray-50"
                            }`;


                            return (
                                <tr key={user.userId}>
                                    <td className={className}>
                                        <div className="flex items-center gap-4">
                                            <Avatar
                                                src={"https://cdnphoto.dantri.com.vn/Au8icunjIdjAao2SrF0OZWJkRO8=/thumb_w/1360/2025/05/26/jack1-1748272770861.jpg"}
                                                alt={user.fullName}
                                                size="sm"
                                                variant="rounded"
                                            />
                                            <div>
                                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                                    {user.fullName || '<empty>'}
                                                </Typography>
                                                <Typography className="text-xs font-normal text-blue-gray-500">
                                                    {user.email}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={className}>
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {userRole === "admin"
                                                ? `${user.createdAt}`
                                                : `Total: ${user.reportCount}`}
                                        </Typography>
                                    </td>
                                    <td className={className}>
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {user.birthDate || '<empty>'}
                                        </Typography>
                                    </td>
                                    <td className={className}>
                                        <Chip
                                            variant="gradient"
                                            color={user.status === "Active" ? "green" : "blue-gray"}
                                            value={user.status === "Active" ? "ACTIVE" : "INACTIVE"}
                                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                        />
                                    </td>
                                    <td className={className}>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleResetPassword(user.email)}
                                                className="text-xs font-semibold text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                                            >
                                                Reset password
                                            </button>
                                            <Link to={`/dashboard/${userRole}s/${user.userId}/posts`}
                                                  className="text-xs font-semibold text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-red-50">
                                                View details
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    <div className="flex justify-center items-center gap-4 mt-4">
                        <button onClick={() => {
                            (page + 1 > 1) ? setPage(page - 1) : setPage(page)
                        }}
                                className="px-3 py-1 rounded text-blue-600 bg-white text-sm font-semibold hover:bg-blue-700 hover:text-white">
                            Prev
                        </button>
                        <button
                            className="px-4 py-1 rounded bg-blue-800 text-white text-sm font-semibold cursor-default">
                            {page + 1}/{totalPages}
                        </button>
                        <button onClick={() => {
                            (page + 1 < totalPages) ? setPage(page + 1) : setPage(page)
                        }}
                                className="px-3 py-1 rounded text-blue-600 bg-white text-sm font-semibold hover:bg-blue-700 hover:text-white">
                            Next
                        </button>
                    </div>
                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                <h2 className="text-xl font-semibold mb-4">Add Admin</h2>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={addAdminEmail}
                                    onChange={(e) => setAddAdminEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-gray-700 hover:text-black"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleAddAdmin(addAdminEmail);
                                            setShowModal(false);
                                            setAddAdminEmail("");
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}

export default Users;
