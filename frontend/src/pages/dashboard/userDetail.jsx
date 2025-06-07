import {useParams, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";
import UserTabs from "/src/pages/dashboard/userTab.jsx";

const tabs = [
    {label: "Posts", key: "posts"},
    {label: "Comments", key: "comments"},
    {label: "Reports Made", key: "reportsMade"},
    {label: "Reports Received", key: "reportsReceived"},
    {label: "Enrollments", key: "enrollments"},
    {label: "Scores", key: "scores"},
    {label: "Cart", key: "cart"},
    {label: "Notifications", key: "notifications"},
    {label: "Ratings", key: "ratings"},
    {label: "Transactions", key: "transactions"},
];

function formatKey(key) {
    if (!key) return "";
    return key
        .replace(/([A-Z])/g, " $1")   // thêm dấu cách trước chữ in hoa
        .replace(/^./, (str) => str.toUpperCase()) // viết hoa chữ đầu
        .trim(); // xóa khoảng trắng đầu/cuối
}

export default function UserDetail() {
    const {userId} = useParams();
    const [selectedTab, setSelectedTab] = useState("posts");
    const [userInfo, setUserInfo] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoadingUser(true);
                const res = await axios.get(`http://localhost:8081/api/users/${userId}`);
                setUserInfo(res.data);
            } catch (err) {
                console.error("Failed to load user info:", err);
                setUserInfo(null);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserInfo();
    }, [userId]);

    return (
        <div className="p-6">

            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 shadow-sm mb-6 text-sm">
                {loadingUser ? (
                    <div className="text-blue-600">Loading user information...</div>
                ) : userInfo ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(userInfo).map(([key, value]) => (
                            <div key={key}>
                                <span className="font-medium text-blue-800">{formatKey(key)}:</span>{" "}
                                <span className="text-gray-700">
                                    {typeof value === "object" ? JSON.stringify(value) : value}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-red-500">Failed to load user data.</div>
                )}
            </div>

            <div className="border-b border-blue-200 mb-6">
                <nav className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => {setSelectedTab(tab.key);
                                                    navigate(`/dashboard/users/${userId}/${tab.key}`);}}
                            className={`px-4 py-2 rounded-t-md text-sm transition-all duration-200 ${
                                selectedTab === tab.key
                                    ? "bg-white border border-b-0 border-blue-500 text-blue-700 font-semibold shadow-sm"
                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
                <UserTabs userId={userId} tab={selectedTab}/>
            </div>
        </div>
    );
}
