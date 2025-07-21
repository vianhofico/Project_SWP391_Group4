import {useParams, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import UserTabs from "/src/pages/dashboard/userTab.jsx";
import {getUserById} from "@/api/userApi.js";

const tabs = [
    {label: "Posts", key: "posts"},
    {label: "Comments", key: "comments"},
    {label: "Reports Made", key: "reportsMade"},
    {label: "Reports Received", key: "reportsReceived"},
    {label: "Enrollments", key: "enrollments"},
    {label: "Scores", key: "scores"},
    {label: "Cart", key: "cart"},
    {label: "Ratings", key: "ratings"},
];

function formatKey(key) {
    if (!key) return "";
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
}

export default function UserDetail() {
    const {userId} = useParams();
    const [selectedTab, setSelectedTab] = useState("posts");
    const [userInfo, setUserInfo] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [userRole, setUserRole] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoadingUser(true);
                const res = await getUserById(userId);
                setUserInfo(res.data);
                setUserRole(res.data.role.toLowerCase());
            } catch (err) {
                console.error("Failed to load user info:", err);
                setUserInfo(null);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserInfo();
    }, [userId]);

    const availableTabs = userRole === "admin"
        ? []
        : tabs;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">User Profile</h1>
                    <p className="text-blue-600">Manage and view user information</p>
                </div>

                {/* User Info Section */}
                <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            User Information
                        </h2>
                    </div>

                    <div className="p-6">
                        {loadingUser ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex items-center space-x-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                                    <span className="text-blue-600 font-medium">Loading user information...</span>
                                </div>
                            </div>
                        ) : userInfo ? (
                            <div className="space-y-6">
                                {/* Avatar Section */}
                                {Object.entries(userInfo).some(([key]) => key.toLowerCase().includes("image")) && (
                                    <div className="flex justify-center mb-8">
                                        <div className="relative">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg bg-gray-100">
                                                <img
                                                    src="https://cdnphoto.dantri.com.vn/Au8icunjIdjAao2SrF0OZWJkRO8=/thumb_w/1360/2025/05/26/jack1-1748272770861.jpg"
                                                    alt="User Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* User Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(userInfo).map(([key, value]) =>
                                        !key.toLowerCase().includes("image") ? (
                                            <div key={key} className="bg-blue-50 rounded-lg p-4 border border-blue-100 hover:shadow-md transition-shadow duration-200">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-blue-800 mb-1">
                                                        {formatKey(key)}
                                                    </span>
                                                    <span className="text-gray-700 font-medium break-words">
                                                        {typeof value === "object" && value !== null
                                                            ? JSON.stringify(value, null, 2)
                                                            : value || "N/A"
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        ) : null
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                    </svg>
                                    <p className="text-red-500 font-semibold text-lg">Failed to load user data</p>
                                    <p className="text-gray-500 mt-1">Please try refreshing the page</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs Section */}
                {userRole !== "admin" && (
                    <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
                        {/* Tabs Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                                User Activities
                            </h2>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="border-b border-blue-100 bg-blue-50">
                            <nav className="flex flex-wrap gap-1 p-4">
                                {availableTabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => {
                                            setSelectedTab(tab.key);
                                            navigate(`/dashboard/${userRole}/${userId}/${tab.key}`);
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                            selectedTab === tab.key
                                                ? "bg-blue-600 text-white shadow-md transform scale-105"
                                                : "bg-white text-blue-600 hover:bg-blue-100 hover:shadow-sm border border-blue-200"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 min-h-[400px] bg-gray-50">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-full">
                                <UserTabs userId={userId} tab={selectedTab}/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}