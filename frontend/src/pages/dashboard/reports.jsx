import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {getAllReports} from "@/api/reportApi.js";
import { useNavigate, Link, useParams } from "react-router-dom";

export function Reports() {

    const [reportList, setReportList] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [checkChangeStatus, setCheckChangeStatus] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc');
    const [reporterName, setReporterName] = useState('');
    const [targetName, setTargetName] = useState('');
    const [reportType, setReportType] = useState('');
    const navigate = useNavigate();
    const { status } = useParams();

    useEffect(() => {
        const validStatuses = ["pending", "approved", "rejected"];
        if (!validStatuses.includes(status)) {
            navigate("/dashboard/reports/pending");
        }
    }, [status]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await getAllReports({
                    reporterName,
                    targetName,
                    sortOrder,
                    status,
                    reportType,
                    page,
                    size
                });
                setReportList(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.log("Lỗi khi fetch reports:", err);
            }
        }
        fetchReports();
    }, [page, checkChangeStatus, status, reporterName, targetName, sortOrder, reportType]);

    useEffect(() => {
        console.log(reportList);
    }, [reportList]);

    const changeStatus = async (reportId, status) => {
        const confirmText = status === "approved"
            ? "Do you confirm approve of this report?"
            : "Do you confirm reject of this report?";
        if (!window.confirm(confirmText)) return;
        try {
            await axios.put(`http://localhost:8081/api/${reportId}`, {
                status: status
            });
            setCheckChangeStatus(!checkChangeStatus);
            alert("Update successfully!");
        } catch (err) {
            console.log("Lỗi khi set status:", err);
        }
    }

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <div className="flex gap-4 px-4">
                {["pending", "approved", "rejected"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setPage(0);
                            navigate(`/dashboard/reports/${tab}`);
                        }}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 ${
                            status === tab
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-blue-600"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 px-4">
                {/* Input Search */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Search reporter</label>
                    <input
                        type="text"
                        value={reporterName}
                        placeholder="Search by name"
                        onChange={(e) => setReporterName(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Search target</label>
                    <input
                        type="text"
                        value={targetName}
                        placeholder="Search by name"
                        onChange={(e) => setTargetName(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Report type</label>
                    <select
                        value={reportType}
                        onChange={(e) => {
                            setReportType(e.target.value);
                            setPage(0)
                        }}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                        <option value="">All</option>
                        <option value="SPAM">Spam</option>
                        <option value="INAPPROPRIATE_LANGUAGE">Inappropriate language</option>
                        <option value="HARASSMENT">Harassment</option>
                        <option value="MISINFORMATION">Misinformation</option>
                        <option value="CHEATING">Cheating</option>
                        <option value="VIOLATES_GUIDELINES">Violates guidelines</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Sort by time</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                        <option value="desc">Latest</option>
                        <option value="asc">Oldest</option>
                    </select>
                </div>

            </div>
            <Card>
                <CardHeader variant="gradient" className="mb-8 p-6 bg-[#4e73df]">
                    <Typography variant="h6" color="white">
                        {status.charAt(0).toUpperCase() + status.slice(1)} Reports
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">

                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                        <tr>
                            {["Reporter", "Target", "Reason", "Created At", "Status", "Action"].map((el) => (
                                <th
                                    key={el}
                                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                >
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
                        {reportList.map(
                            (report, index) => {
                                const className = `py-3 px-5 ${
                                    index === reportList.length - 1
                                        ? ""
                                        : "border-b border-blue-gray-50"
                                }`;

                                return (
                                    <tr key={report.reportId}>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="max-w-[300px] break-words"
                                            >
                                                {report.reporter.fullName}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-md font-semibold text-blue-gray-600">
                                                {report.target.fullName}
                                            </Typography>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                Reports: {report.target.reportCount}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                as="a"
                                                href="#"
                                                className="text-xs font-semibold text-blue-gray-600 max-w-[300px] break-words whitespace-normal"
                                            >
                                                {report.reportType}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {report.createdAt}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Chip
                                                variant="gradient"
                                                color={
                                                    status === "pending"
                                                        ? "blue-gray"
                                                        : status === "approved"
                                                            ? "green"
                                                            : status === "rejected"
                                                                ? "red"
                                                                : "gray"
                                                }
                                                value={status.toUpperCase()}
                                                className="py-0.5 px-2 text-[11px] font-medium w-fit capitalize"
                                            />
                                        </td>

                                        <td className={className}>
                                            <div className="flex space-x-2">
                                                <Link
                                                    to={`/dashboard/reports/${report.reportId}/check`}
                                                    className="text-xs font-semibold text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                                                >
                                                    View details
                                                </Link>
                                            </div>
                                        </td>

                                    </tr>
                                );
                            }
                        )}
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

export default Reports;
