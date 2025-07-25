import React, { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { getAllStats, getMonthlyRevenue } from "@/api/statisticApi.js";


const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57", "#8dd1e1", "#83a6ed"];


export default function CourseStatistics() {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({
        activeItems: 0,
        itemsSold: 0,
        monthlyRevenue: 0,
        totalUsers: 0,
        ticketsClosed: 0,
        totalIncome: 0
    });
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);


    useEffect(() => {
        fetchStats();
    }, []);


    const fetchStats = async () => {
        try {
            const res = await getAllStats();
            const result = res.data;

            setData(result);

            const res2 = await getMonthlyRevenue();
            setMonthlyRevenue(res2.data);



            // Tính toán dữ liệu tổng hợp
            const totalRevenue = result.reduce((acc, cur) => acc + cur.revenue, 0);
            const totalStudents = result.reduce((acc, cur) => acc + cur.studentCount, 0);
            setStats({
                activeItems: result.length,
                itemsSold: totalStudents,
                totalIncome: totalRevenue
            });

        } catch (error) {
            console.error("Lỗi load thống kê:", error);
        }
    };


    const formatVND = (val) => val.toLocaleString("vi-VN") + "₫";
    const pieRaw = data
        .sort((a, b) => b.revenue - a.revenue)
        .map((item) => ({ name: item.title, value: item.revenue }));

    const topN = 6;
    const pieData = pieRaw.length > topN
        ? [...pieRaw.slice(0, topN), {
            name: "Others",
            value: pieRaw.slice(topN).reduce((sum, item) => sum + item.value, 0)
        }]
        : pieRaw;

    const barData = data.map((item) => ({
        name: item.title.length > 16 ? item.title.slice(0, 16) + "..." : item.title,
        students: item.studentCount
    }));

    const monthlyData = monthlyRevenue.map(item => ({
        month: `${item.month}`,
        revenue: item.revenue
    }));

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📊 Course Statistics Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <StatBox label="📘 Active Items" value={stats.activeItems} />
                <StatBox label="🛒 Items Sold" value={stats.itemsSold} />
                <StatBox label="💰 Total Income" value={formatVND(stats.totalIncome)} />
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white rounded shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">📆 Monthly Revenue</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(v) => `${v / 1_000_000}tr`} />
                            <Tooltip formatter={(v) => formatVND(v)} />
                            <Bar dataKey="revenue" fill="#8884d8" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Revenue Breakdown + Student Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Doughnut Pie */}
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-lg font-semibold mb-2">💸 Revenue Breakdown</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%" cy="50%"
                                    innerRadius={40}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatVND(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Horizontal Bar Chart */}
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-lg font-semibold mb-2">👥 Student Count</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={100} />
                                <Tooltip />
                                <Bar dataKey="students" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table (giữ nguyên) */}
            <div className="bg-white rounded shadow p-4">
                <h2 className="text-xl font-semibold mb-4">📚 Course List</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2 text-left">Course ID</th>
                            <th className="border px-4 py-2 text-left">Title</th>
                            <th className="border px-4 py-2 text-right">Students</th>
                            <th className="border px-4 py-2 text-right">Revenue</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item) => (
                            <tr key={item.courseId}>
                                <td className="border px-4 py-2">{item.courseId}</td>
                                <td className="border px-4 py-2">{item.title}</td>
                                <td className="border px-4 py-2 text-right">{item.studentCount}</td>
                                <td className="border px-4 py-2 text-right">{formatVND(item.revenue)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
    function StatBox({ label, value }) {
        return (
            <div className="bg-white rounded shadow p-4 text-center">
                <div className="text-xl font-semibold text-gray-700">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
            </div>
        );
    }
}
