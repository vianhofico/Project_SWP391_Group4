import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {getAllOrders} from "@/api/orderApi.js"
import Swal from 'sweetalert2';

export function Orders() {

    const [orderList, setOrderList] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [email, setEmail] = useState('');
    // const [userName, setUserName] = useState('');
    const [sortBy, setSortBy] = useState('createdAt_desc');

    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const [minPriceError, setMinPriceError] = useState('');
    const [maxPriceError, setMaxPriceError] = useState('');

    const navigate = useNavigate();


    useEffect(() => {
        fetchOrders(); // gọi dữ liệu mặc định ngay khi render lần đầu
    }, [page]);

    const isValidNumber = (value) => {
        return /^(\d+)(\.\d+)?$/.test(value);
    };

    const fetchOrders = async (resetPage = false) => {
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid date range',
                text: 'Start date must be before end date',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
                }
            });
            return;
        }

        // let hasError = false;

        // setMinPriceError('');
        // setMaxPriceError('');

        // if (minPrice !== '' && !isValidNumber(minPrice)) {
        //     setMinPriceError('Min Price must be a number');
        //     hasError = true;
        // }
        //
        // if (maxPrice !== '' && !isValidNumber(maxPrice)) {
        //     setMaxPriceError('Max Price must be a number');
        //     hasError = true;
        // }


        if (minPrice !== '' && !isValidNumber(minPrice)) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Input',
                text: 'Min price must be a valid number',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
                }
            });
            return;
        }

        if (maxPrice !== '' && !isValidNumber(maxPrice)) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Input',
                text: 'Max price must be a valid number',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
                }
            });
            return;
        }

        if (
            minPrice !== '' &&
            maxPrice !== '' &&
            isValidNumber(minPrice) &&
            isValidNumber(maxPrice) &&
            parseFloat(minPrice) > parseFloat(maxPrice)
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Price Range',
                text: 'Min price cannot be greater than max price',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
                }
            });
            return;
        }

        // if (
        //     minPrice !== '' &&
        //     maxPrice !== '' &&
        //     isValidNumber(minPrice) &&
        //     isValidNumber(maxPrice) &&
        //     parseFloat(minPrice) > parseFloat(maxPrice)
        // ) {
        //     setMinPriceError('Min Price must not be greater than Max Price');
        //     hasError = true;
        // }


        // if (hasError) return;

        try {
            const params = {
                page: resetPage ? 0 : page,
                size: size,
                // sortBy: sortBy
                sortBy: `${sortField}_${sortDirection}`
            };

            if (minPrice !== '') params.minPrice = minPrice;
            if (maxPrice !== '') params.maxPrice = maxPrice;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            if (email) params.email = email;
            // if (userName) params.userName = userName;

            const res = await getAllOrders(params);
            setOrderList(res.data.content);
            setTotalPages(res.data.totalPages);
            if (res.data.totalPages === 0) {
                setPage(0);
            }
            if (resetPage) setPage(0);
        } catch (err) {
            console.log("Lỗi khi fetch reports:", err);
        }
    };

    const resetFilters = async() => {
        // setUserName('');
        setEmail('');
        setStartDate('');
        setEndDate('');
        // setSortBy('createdAt_desc');
        setSortField('createdAt');
        setSortDirection('desc');

        setMinPrice('');
        setMaxPrice('');
        setMinPriceError('');
        setMaxPriceError('');
        setPage(0); // reset về trang đầu

        try {
            const res = await getAllOrders({
                page: 0,
                size: size,
                sortBy: 'createdAt_desc',
            });
            setOrderList(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.log("Lỗi khi reset lọc:", err);
        }
    };



    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <div className="flex flex-col gap-4 px-4">
                <div className="flex flex-wrap gap-4">

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Order By User: </label>
                        <input
                            type="text"
                            placeholder="Search by user"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            // onChange={(e) => setUserName(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">From Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">To Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                    </div>


                    {/*<div className="flex flex-col">*/}
                    {/*    <label className="text-xs text-gray-600 mb-1">Sort By</label>*/}
                    {/*    <select*/}
                    {/*        value={sortBy}*/}
                    {/*        onChange={(e) => setSortBy(e.target.value)}*/}
                    {/*        className="border border-gray-300 rounded-md px-2 py-1 text-sm">*/}
                    {/*        <option value="createdAt_desc">Time: Latest</option>*/}
                    {/*        <option value="createdAt_asc">Time: Oldest</option>*/}
                    {/*        <option value="totalPrice_desc">Amount: Descending</option>*/}
                    {/*        <option value="totalPrice_asc">Amount: Ascending</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Sort Field</label>
                        <select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        >
                            <option value="createdAt">Time</option>
                            <option value="totalPrice">Amount</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Sort Direction</label>
                        <select
                            value={sortDirection}
                            onChange={(e) => setSortDirection(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>

                </div>
                <div className="flex flex-wrap gap-4 mt-2">

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Min Price: </label>
                        <input
                            type="text"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                        {minPriceError && (
                            <span className="text-xs text-red-500 mt-1">{minPriceError}</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Max Price: </label>
                        <input
                            type="text"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                        {maxPriceError && (
                            <span className="text-xs text-red-500 mt-1">{maxPriceError}</span>
                        )}
                    </div>
                    <div className="flex flex-col mt-6">
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchOrders(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                            >
                                Filter
                            </button>
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 text-sm font-semibold"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                </div>

            </div>


            <Card>
                <CardHeader variant="gradient" className="mb-8 p-6 bg-[#4e73df]">
                    <Typography variant="h6" color="white">
                        Orders
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">

                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                        <tr>
                            {["Order ID", "Amount", "Created At", "User", "Detail"].map((el) => (
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
                        {orderList.map(
                            (order, index) => {
                                const className = `py-3 px-5 ${
                                    index === orderList.length - 1
                                        ? ""
                                        : "border-b border-blue-gray-50"
                                }`;

                                return (
                                    <tr key={order.orderId}>
                                        <td className={`${className} max-w-[200px] truncate`}>
                                            <Typography className="text-md font-semibold text-blue-gray-600">
                                                {order.orderId}
                                            </Typography>
                                        </td>
                                        <td className={`${className} max-w-[300px] truncate`}>
                                            <Typography
                                                as="a"
                                                href="#"
                                                className="text-xs font-semibold text-blue-gray-600"
                                            >
                                                {order.amount}
                                            </Typography>
                                        </td>
                                        <td className={`${className} max-w-[120px] truncate`}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {order.createdAt}
                                            </Typography>
                                        </td>
                                        <td className={`${className} max-w-[160px] truncate`}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {order.user.email}
                                            </Typography>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => navigate("/dashboard/orderItems", { state: { orderId: order.orderId } })}
                                                className="text-xs font-semibold text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                                            >
                                                View details
                                            </button>

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
                            {totalPages > 0 ? `${page + 1}/${totalPages}` : '0/0'}
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

export default Orders;
