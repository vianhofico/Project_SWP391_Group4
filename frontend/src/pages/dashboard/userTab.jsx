import { useEffect, useState } from "react";
import axios from "axios";

function formatKey(key) {
    if (!key) return "";
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
}

export default function UserTabs({ userId, tab }) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:8081/api/users/${userId}/${tab}`);
                setData(res.data.content || res.data);
            } catch (err) {
                console.error(err);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, tab]);

    const handleEdit = (item) => {
        alert(`Edit item with ID: ${item.id || "unknown"}`);
        // TODO: custom xử lý edit ở đây
    };


    const renderValue = (value) => {
        if (value === null || value === undefined) {
            return <span className="text-gray-400 italic">null</span>;
        }

        if (typeof value === "object") {
            return (
                <div className="ml-4 border-l pl-4 space-y-1 text-sm bg-white rounded-md shadow-sm">
                    {Object.entries(value).map(([subKey, subValue]) => (
                        <div key={subKey}>
                            <span className="text-blue-700 font-medium">{formatKey(subKey)}:</span>{" "}
                            {typeof subValue === "object"
                                ? renderValue(subValue)
                                : <span className="text-gray-700">{String(subValue)}</span>}
                        </div>
                    ))}
                </div>
            );
        }

        return <span className="text-gray-700">{String(value)}</span>;
    };

    if (loading) return <div className="text-blue-600 font-semibold">Loading {tab}...</div>;
    if (!data) return <div className="text-red-500 font-semibold">Error loading data.</div>;

    const isArray = Array.isArray(data);

    return (
        <div className="overflow-x-auto bg-white rounded shadow p-4">
            {isArray ? (
                data.length === 0 ? (
                    <div className="text-gray-500 italic">No data found.</div>
                ) : (
                    <table className="min-w-full table-auto border-collapse text-sm">
                        <thead>
                        <tr className="bg-blue-100 text-left">
                            {Object.keys(data[0]).map((key) => (
                                <th key={key} className="px-4 py-2 border text-blue-800">
                                    {formatKey(key)}
                                </th>
                            ))}
                            <th className="px-4 py-2 border text-blue-800 text-center">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, idx) => (
                            <tr key={idx} className="hover:bg-blue-50 align-top">
                                {Object.values(item).map((val, i) => (
                                    <td key={i} className="px-4 py-2 border max-w-xs break-words">
                                        {renderValue(val)}
                                    </td>
                                ))}
                                <td className="px-4 py-2 border text-center space-y-2 whitespace-nowrap">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="block w-full border border-blue-600 rounded-md px-3 py-1 text-blue-600 font-semibold hover:bg-blue-100"
                                        aria-label="Edit"
                                    >
                                        View
                                    </button>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                )
            ) : (
                <div className="bg-gray-50 p-4 rounded shadow-sm border text-sm space-y-3">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                            <span className="font-bold text-blue-800 min-w-[120px]">{formatKey(key)}:</span>
                            <div className="flex-1">{renderValue(value)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
