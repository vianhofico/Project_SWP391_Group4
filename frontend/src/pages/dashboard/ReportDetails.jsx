import React, {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom";
import {checkReport, getReportById} from "@/api/reportApi.js";

export default function ReportDetails() {

    const [report, setReport] = useState({});
    const {reportId} = useParams();
    const [checkChanges, setCheckChanges] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await getReportById(reportId);
                setReport(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchReport();
    }, [reportId, checkChanges]);

    const handleReport = async (reportId, status) => {
        try {
            let confirmText = "";
            if (status === "APPROVED") {
                confirmText = "Are you sure you want to approve this report?";
            } else {
                confirmText = "Are you sure you want to reject this report?";
            }
            if (!window.confirm(confirmText)) {
                return
            }
            await checkReport(reportId, {status});
            setCheckChanges(!checkChanges);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="h-screen bg-gray-100 py-6 px-6 overflow-auto">
            <div
                className="w-full max-w-6xl h-full mx-auto bg-white shadow-lg rounded-xl border border-gray-200 flex flex-col">
                <div className="bg-[#4e73df] rounded-t-xl px-6 py-4">
                    <h1 className="text-white text-2xl font-bold">Report Details</h1>
                </div>

                <div className="p-6 space-y-5 flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Reporter</p>
                            <p className="text-base font-semibold text-gray-800">{report.reporter?.fullName}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">Target</p>
                            <p className="text-base font-semibold text-gray-800">
                                {report.target?.fullName}
                                <span
                                    className="ml-2 text-sm text-gray-500">(Reports: {report.target?.reportCount})</span>
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">Report Type</p>
                            <p className="text-base font-semibold text-gray-800">{report.reportType}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">Status</p>
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                                ${report.status?.toUpperCase() === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                report.status?.toUpperCase() === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'}`}>
                                {report.status?.toUpperCase()}
                            </span>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">Created At</p>
                            <p className="text-base font-semibold text-gray-800">{report.createdAt}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 font-medium">Description</p>
                        <p className="mt-2 p-4 bg-gray-50 text-sm text-gray-700 rounded-md border border-gray-200">
                            {report.content}
                        </p>
                    </div>

                    {report.post && (
                        <div className="mt-6">
                            <p className="text-sm text-gray-500 font-medium">Reported Post</p>
                            <div className="mt-2 border border-gray-200 bg-gray-50 rounded-md p-4 space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Title: {report.post.title}</p>
                                    <p className="text-sm text-gray-700">Content: {report.post.content}</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/dashboard/posts/${report.post.postId}`)}
                                    className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
                                >
                                    View Post
                                </button>
                            </div>
                        </div>
                    )}

                    {report.comment && (
                        <div className="mt-6">
                            <p className="text-sm text-gray-500 font-medium">Reported Comment</p>
                            <div className="mt-2 border border-gray-200 bg-gray-50 rounded-md p-4 space-y-3">
                                <div>
                                    <p className="text-sm text-gray-700">{report.comment.content}</p>
                                    <p className="text-xs text-gray-500">{report.comment.createdAt}</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/dashboard/posts/${report.comment.postId}`)}
                                    className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
                                >
                                    View Post
                                </button>
                            </div>
                        </div>
                    )}


                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-between flex-wrap gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-5 py-2 rounded-md text-sm"
                    >
                        Back
                    </button>

                    <div className="flex gap-3">
                        {(report.status?.toUpperCase() === "PENDING" || report.status?.toUpperCase() === "APPROVED") && (
                            <button
                                onClick={() => handleReport(report.reportId, "REJECTED")}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-md text-sm"
                            >
                                Reject
                            </button>
                        )}

                        {(report.status?.toUpperCase() === "PENDING" || report.status?.toUpperCase() === "REJECTED") && (
                            <button
                                onClick={() => handleReport(report.reportId, "APPROVED")}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-md text-sm"
                            >
                                Approve
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
