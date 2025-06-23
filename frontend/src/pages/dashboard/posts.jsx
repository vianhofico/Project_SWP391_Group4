import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

export function Posts() {

    const [postList, setPostList] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [checkChangeStatus, setCheckChangeStatus] = useState(false);
    const [title, setTitle] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [postTopicList, setPostTopicList] = useState([]);
    const [postTopicId, setPostTopicId] = useState("");
    const [status, setStatus] = useState("ACTIVE");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/posts`, {
                    params: {
                        title: title,
                        postTopicId: postTopicId,
                        sortOrder: sortOrder,
                        status: status,
                        page: page,
                        size: size
                    }
                });
                setPostList(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.log("Lỗi khi fetch reports:", err);
            }
        }
        fetchPosts();
    }, [page, checkChangeStatus, sortOrder, title, postTopicId, status]);

    useEffect(() => {
        const fetchPostTopics = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/posttopics`);
                setPostTopicList(res.data);
            } catch (err) {
                console.log("Lỗi khi fetch reports:", err);
            }
        }
        fetchPostTopics();
    }, []);

    const deletePost = async (postId, title) => {
        const confirmText = `Are you sure you want to delete post with title: "${title}"?`;
        if (!window.confirm(confirmText)) return;
        try {
            await axios.put(`http://localhost:8081/api/posts/${postId}`);
            setCheckChangeStatus(!checkChangeStatus);
            alert("Delete successfully!");
        } catch (err) {
            console.log("Lỗi khi set delete:", err);
        }
    }


    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <div className="flex flex-wrap items-center gap-4 px-4">
                <div className="flex flex-col font-semibold text-base">
                    <label className="text-sm text-gray-700 mb-1">Select Topic</label>
                    <select
                        onChange={(e) => setPostTopicId(e.target.value)}
                        className="border border-blue-500 rounded-md px-3 py-2 text-sm bg-blue-50 focus:outline-none">
                        <option value="">All topic</option>
                        {postTopicList.map(topic => (
                            <option key={topic.postTopicId} value={topic.postTopicId}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Title</label>
                    <input
                        type="text"
                        placeholder="Search by title"
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                        <option value="ACTIVE">Active</option>
                        <option value="DELETED">Deleted</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Sort</label>
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
                        Posts
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">

                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                        <tr>
                            {["Title", "Content", "Created At", "Topic", "Poster", "Status", "Action"].map((el) => (
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
                        {postList.map(
                            (post, index) => {
                                const className = `py-3 px-5 ${
                                    index === postList.length - 1
                                        ? ""
                                        : "border-b border-blue-gray-50"
                                }`;

                                return (
                                    <tr key={post.postId}>
                                        <td className={`${className} max-w-[200px] truncate`}>
                                            <Typography className="text-md font-semibold text-blue-gray-600">
                                                {post.title}
                                            </Typography>
                                        </td>
                                        <td className={`${className} max-w-[300px] truncate`}>
                                            <Typography
                                                as="a"
                                                href="#"
                                                className="text-xs font-semibold text-blue-gray-600"
                                            >
                                                {post.content}
                                            </Typography>
                                        </td>
                                        <td className={`${className} max-w-[120px] truncate`}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {post.createdAt}
                                            </Typography>
                                        </td>
                                        <td className={`${className} max-w-[160px] truncate`}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {post.postTopic.name}
                                            </Typography>
                                        </td>
                                        <td className={`${className} max-w-[180px] truncate`}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                            >
                                                {post.user.fullName}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Chip
                                                variant="gradient"
                                                color={post.status === "ACTIVE" ? "green" : "red"}
                                                value={post.status === "ACTIVE" ? "ACTIVE" : "DELETED"}
                                                className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                            />
                                        </td>
                                        <td className={className}>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="text-xs font-semibold text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                                                >
                                                    View details
                                                </button>
                                                <button
                                                    onClick={() => deletePost(post.postId, post.title)}
                                                    className="text-xs font-semibold text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-50">
                                                    Delete
                                                </button>
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

export default Posts;
