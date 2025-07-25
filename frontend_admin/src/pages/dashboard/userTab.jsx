import {useEffect, useState, useMemo} from "react";
import {getTabFromUser} from "@/api/userApi.js";

function formatKey(key) {
    if (!key) return "";
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
}

function formatDateTime(value) {
    if (!value) return value;

    // Kiểm tra nếu là string có dạng ISO date hoặc timestamp
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    const timestampRegex = /^\d{13}$/; // 13 digits for millisecond timestamp

    let date;

    if (typeof value === 'string' && dateRegex.test(value)) {
        date = new Date(value);
    } else if (typeof value === 'string' && timestampRegex.test(value)) {
        date = new Date(parseInt(value));
    } else if (typeof value === 'number' && value > 1000000000000) { // timestamp check
        date = new Date(value);
    } else {
        return value; // Không phải format thời gian
    }

    // Kiểm tra date có hợp lệ không
    if (isNaN(date.getTime())) return value;

    // Format theo định dạng dễ đọc
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

function isDateTimeField(key, value) {
    if (!key || !value) return false;

    // Kiểm tra tên field có chứa từ khóa thời gian
    const timeKeywords = ['date', 'time', 'created', 'updated', 'at', 'on', 'timestamp'];
    const keyLower = key.toLowerCase();
    const hasTimeKeyword = timeKeywords.some(keyword => keyLower.includes(keyword));

    if (!hasTimeKeyword) return false;

    // Kiểm tra value có dạng thời gian không
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    const timestampRegex = /^\d{13}$/;

    return (typeof value === 'string' && (dateRegex.test(value) || timestampRegex.test(value))) ||
        (typeof value === 'number' && value > 1000000000000);
}

export default function UserTabs({userId, tab}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getTabFromUser(userId, tab);

                let extractedData = res.data.content || res.data;

                // Special handling for cart tab
                if (tab === 'cart' && extractedData && typeof extractedData === 'object' && !Array.isArray(extractedData)) {
                    // Tìm kiếm array courses trong cart object
                    if (extractedData.courses) {
                        extractedData = extractedData.courses;
                    } else if (extractedData.items) {
                        extractedData = extractedData.items;
                    } else if (extractedData.cartItems) {
                        extractedData = extractedData.cartItems;
                    } else {
                        // Tìm array đầu tiên trong object
                        const arrayValues = Object.values(extractedData).filter(val => Array.isArray(val));
                        if (arrayValues.length > 0) {
                            extractedData = arrayValues[0];
                        }
                    }
                }

                setData(extractedData);
                setFilters({}); // Reset filters khi data mới
            } catch (err) {
                console.error(err);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, tab]);

    // Lấy danh sách các trường có thể filter (chỉ với array data)
    const filterableFields = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) return [];
        return Object.keys(data[0]).filter(key => {
            // Chỉ filter các trường có giá trị string, number, boolean
            const sampleValue = data[0][key];
            return typeof sampleValue === 'string' ||
                typeof sampleValue === 'number' ||
                typeof sampleValue === 'boolean';
        });
    }, [data]);

    // Filter data dựa trên filters
    const filteredData = useMemo(() => {
        if (!data || !Array.isArray(data)) return data;

        return data.filter(item => {
            return Object.entries(filters).every(([field, filterValue]) => {
                if (!filterValue || filterValue === '') return true;

                const itemValue = item[field];
                if (itemValue === null || itemValue === undefined) return false;

                // Convert to string để so sánh
                const itemStr = String(itemValue).toLowerCase();
                const filterStr = String(filterValue).toLowerCase();

                return itemStr.includes(filterStr);
            });
        });
    }, [data, filters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    const renderFilterControls = () => {
        if (!Array.isArray(data) || filterableFields.length === 0) return null;

        return (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-blue-800">Filter Options</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={clearFilters}
                            className="text-xs px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                            disabled={Object.keys(filters).length === 0}
                        >
                            Clear All
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filterableFields.map(field => (
                            <div key={field} className="flex flex-col">
                                <label className="text-xs font-medium text-gray-700 mb-1">
                                    {formatKey(field)}
                                </label>
                                <input
                                    type="text"
                                    placeholder={`Filter by ${formatKey(field)}...`}
                                    value={filters[field] || ''}
                                    onChange={(e) => handleFilterChange(field, e.target.value)}
                                    className="text-xs px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Hiển thị số lượng kết quả */}
                <div className="mt-3 text-xs text-gray-600">
                    Showing {Array.isArray(filteredData) ? filteredData.length : 0} of {Array.isArray(data) ? data.length : 0} records
                    {Object.keys(filters).some(key => filters[key]) && (
                        <span className="ml-2 text-blue-600 font-medium">(filtered)</span>
                    )}
                </div>
            </div>
        );
    };

    const renderValue = (value, key = '') => {
        if (value === null || value === undefined) {
            return <span className="text-gray-400 italic">null</span>;
        }

        // Format thời gian nếu là trường thời gian
        if (isDateTimeField(key, value)) {
            const formattedTime = formatDateTime(value);
            if (formattedTime !== value) {
                return (
                    <span className="text-gray-700">
                        <span className="font-medium">{formattedTime}</span>
                        <br />
                        <span className="text-xs text-gray-500">({value})</span>
                    </span>
                );
            }
        }

        if (typeof value === "object") {
            return (
                <div className="ml-4 border-l pl-4 space-y-1 text-sm bg-white rounded-md shadow-sm">
                    {Object.entries(value).map(([subKey, subValue]) => (
                        <div key={subKey}>
                            <span className="text-blue-700 font-medium">{formatKey(subKey)}:</span>{" "}
                            {typeof subValue === "object"
                                ? renderValue(subValue, subKey)
                                : renderValue(subValue, subKey)}
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
    const displayData = isArray ? filteredData : data;

    return (
        <div className="overflow-x-auto bg-white rounded shadow p-4">
            {/* Render filter controls */}
            {renderFilterControls()}

            {isArray ? (
                displayData.length === 0 ? (
                    <div className="text-gray-500 italic">
                        {Array.isArray(data) && data.length > 0
                            ? "No data matches the current filters."
                            : tab === 'cart' ? "No courses in cart." : "No data found."
                        }
                    </div>
                ) : (
                    <table className="min-w-full table-auto border-collapse text-sm">
                        <thead>
                        <tr className="bg-blue-100 text-left">
                            {Object.keys(displayData[0]).map((key) => (
                                <th key={key} className="px-4 py-2 border text-blue-800">
                                    {formatKey(key)}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {displayData.map((item, idx) => (
                            <tr key={idx} className="hover:bg-blue-50 align-top">
                                {Object.entries(item).map(([key, val], i) => (
                                    <td key={i} className="px-4 py-2 border max-w-xs break-words">
                                        {renderValue(val, key)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )
            ) : (
                <div className="bg-gray-50 p-4 rounded shadow-sm border text-sm space-y-3">
                    <div className="text-sm text-gray-600 mb-2">
                        Raw data view (not a list format):
                    </div>
                    {Object.entries(displayData).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                            <span className="font-bold text-blue-800 min-w-[120px]">{formatKey(key)}:</span>
                            <div className="flex-1">{renderValue(value, key)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}