import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import axios from "axios";

export function Reports() {

    const [reportList, setReportList] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [checkChangeStatus, setCheckChangeStatus] = useState(false);
    const [status, setStatus] = useState('pending');
    const [sortOrder, setSortOrder] = useState('desc');
    const [reporterName, setReporterName] = useState('');
    const [targetName, setTargetName] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/reports`, {
                    params: {
                        reporterName: reporterName,
                        targetName: targetName,
                        sortOrder: sortOrder,
                        status: status,
                        page: page,
                        size: size
                    }
                });
                setReportList(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.log("Lỗi khi fetch reports:", err);
            }
        }
        fetchReports();
    }, [page, checkChangeStatus, status, reporterName, targetName, sortOrder]);

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
                {/* Sort */}
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

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Select list</label>
                    <select
                        value={status}
                        onChange={(e) => {setStatus(e.target.value);
                                                                            setPage(0)}}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                        <option value="pending">Pending report list</option>
                        <option value="approved">Approved report list</option>
                        <option value="rejected">Rejected report list</option>
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
                                                {report.content}
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
                                                {(status === "pending" || status === "rejected") && (
                                                    <button
                                                        onClick={() => changeStatus(report.reportId, "approved")}
                                                        className="text-xs font-semibold text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                                                    >
                                                        {status === "pending" ? "Approve" : "Change to Approved"}
                                                    </button>
                                                )}

                                                {(status === "pending" || status === "approved") && (
                                                    <button
                                                        onClick={() => changeStatus(report.reportId, "rejected")}
                                                        className="text-xs font-semibold text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-50"
                                                    >
                                                        {status === "pending" ? "Reject" : "Change to Rejected"}
                                                    </button>
                                                )}
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
