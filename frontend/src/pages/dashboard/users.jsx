import {
    Card,
    CardBody,
    Typography,
    Avatar,
    Chip,
    Tooltip,
    Progress,    CardHeader,

} from "@material-tailwind/react";
import {EllipsisVerticalIcon} from "@heroicons/react/24/outline";
import {authorsTableData, projectsTableData} from "@/data";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useLocation, useSearchParams} from "react-router-dom";

export function Users() {

    const [userList, setUserList] = useState([]);
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [checkChange, setCheckChange] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const location = useLocation();
    const [userRole, setUserRole] = useState("");
    useEffect(() => {
        setPage(0);
        if (location.pathname.includes("/admins")) {
            setUserRole("admin");
        } else if (location.pathname.includes("/learners")) {
            setUserRole("learner");
        }
    }, [location.pathname]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/users/${userRole}s`, {
                    params: {
                        role: userRole,
                        status: statusFilter,
                        fullName: searchQuery,
                        sortField: sortField,
                        sortOrder: sortOrder,
                        page: page,
                        size: size
                    },
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
    }, [page, statusFilter, searchQuery, sortField, sortOrder, checkChange, userRole]);

    useEffect(() => {
        console.log("UserList mới:", userList);
        console.log("TotalPages: ", totalPages);
    }, [userList]);

    const resetPassword = async (userId) => {
        const confirmText = "Do you confirm to reset password?";

        if (!window.confirm(confirmText)) return;

        try {
            await axios.put(`http://localhost:8081/api/users/${userId}/reset-password`);
            setCheckChange(!checkChange);
            alert("Reset successfully!");
        } catch (error) {
            console.error(error);
            alert("Error when reset password!");
        }
    };

    const removeUser = async (user) => {
        if (!window.confirm(`Do you confirm remove user ${user.fullName}?`)) return;

        try {
            await axios.delete(`http://localhost:8081/api/users/${user.userId}`)
            setCheckChange(!checkChange);
            alert("Remove successfully!");
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <div className="flex flex-wrap items-center gap-4 px-4">

                {/* Input Search */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Search</label>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                </div>

                {/* Select Status */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm">
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
            </div>
            <Card>
                <CardHeader variant="gradient" className="mb-8 p-6 bg-[#4e73df]">
                    <Typography variant="h6" color="white">{userRole.toUpperCase()} Table</Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 ">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                        <tr>
                            {["FULLNAME", "PASSWORD", "ROLE", "STATUS", "BIRTHDATE", "ACTION"].map((el) => (
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
                                            {user.password}
                                        </Typography>
                                    </td>
                                    <td className={className}>
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {user.role}
                                        </Typography>
                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                            Reports: {user.reportCount}
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
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {user.birthDate || '<empty>'}
                                        </Typography>
                                    </td>
                                    <td className={className}>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => resetPassword(user.userId)}
                                                className="text-xs font-semibold text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                                            >
                                                Reset password
                                            </button>
                                            <Link to={`/dashboard/users/${user.userId}/posts`}
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

                </CardBody>
            </Card>
        </div>
    );
}

export default Users;
