import React, {useEffect, useState} from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
    Button
} from "@material-tailwind/react";
import {useNavigate, useParams} from "react-router-dom";
import {activatePost, deletePost, getFilesByPostId, getPostById, getPostComments} from "@/api/postApi.js";
import {activateComment, deleteComment} from "@/api/commentApi.js";

export function PostDetail() {
    const navigate = useNavigate();
    const [showComments, setShowComments] = useState(false);
    const {postId} = useParams();
    const [post, setPost] = useState({});
    const [checkChanges, setCheckChanges] = useState(true);
    const [commentList, setCommentList] = useState([]);
    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [userFullName, setUserFullName] = useState("");
    const [content, setContent] = useState("");
    const [sortOrder, setSortOrder] = useState("DESC");
    const [commentStatus, setCommentStatus] = useState("");
    const [postFiles, setPostFiles] = useState([]);

    useEffect(() => {
        const fetchPostById = async () => {
            try {
                const res = await getPostById(postId);
                setPost(res.data);
            } catch (err) {
                console.error("Failed to load post:", err);
            }
        }
        fetchPostById();
    }, [postId, checkChanges])

    useEffect(() => {
        const fetchCommentsByPostId = async () => {
            try {
                const res = await getPostComments(postId,
                    {
                        page,
                        size,
                        content,
                        sortOrder,
                        userFullName,
                        status: commentStatus,
                    });
                setCommentList(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error("Failed to load comment:", err);
            }
        }
        fetchCommentsByPostId();
    }, [postId, checkChanges, sortOrder, page, userFullName, content, commentStatus]);

    const changeStatus = async (postId, status) => {
        let confirmText;
        let notification;
        let isActive = true;
        if (status === "ACTIVE") {
            confirmText = "Are you sure to delete this post?";
            notification = "Delete sucessfully!"
        } else if (status === "DELETED") {
            confirmText = "Are you sure to activate this post?";
            notification = "Activate successfully!"
            isActive = false;
        }
        if (!window.confirm(confirmText)) return;
        try {
            if (isActive) {
                await deletePost(postId);
            } else {
                await activatePost(postId);
            }
            setCheckChanges(!checkChanges);
            alert(notification);
        } catch (err) {
            console.log("Error when change status of post:", err);
        }
    }

    useEffect(() => {
        const fetchPostFiles = async () => {
            try {
                const res = await getFilesByPostId(postId);
                setPostFiles(res.data);
            } catch (err) {
                console.error("Failed to load post files:", err);
            }
        };
        fetchPostFiles();
    }, [postId]);


    const handleActionOfComment  = async (commentId, status) => {
        let confirmText;
        let notification;
        let isActive = true;
        if (status === "ACTIVE") {
            confirmText = "Are you sure to delete this comment?";
            notification = "Delete sucessfully!"
        } else if (status === "DELETED") {
            confirmText = "Are you sure to activate this comment?";
            notification = "Activate successfully!"
            isActive = false;
        }
        if (!window.confirm(confirmText)) return;
        try {
            if (isActive) {
                await deleteComment(commentId);
            } else {
                await activateComment(commentId);
            }
            setCheckChanges(!checkChanges);
            alert(notification);
        } catch (err) {
            console.log("Error when change status of comment:", err);
        }
    }

    return (
        <div className="mt-12 mb-8 p-4">
            <Card>
                <CardHeader variant="gradient" className="mb-8 p-6 bg-[#4e73df]">
                    <Typography variant="h6" color="white">
                        Post Details
                    </Typography>
                </CardHeader>
                <CardBody className="px-6 pt-0 pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                            <Typography variant="small" className="font-bold text-blue-gray-500">
                                Title:
                            </Typography>
                            <Typography variant="paragraph" className="text-blue-gray-900 mt-1">
                                {post.title}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="small" className="font-bold text-blue-gray-500">
                                Topic:
                            </Typography>
                            <Typography variant="paragraph" className="text-blue-gray-900 mt-1">
                                {post.postTopic?.name || 'N/A'}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="small" className="font-bold text-blue-gray-500">
                                Poster:
                            </Typography>
                            <Typography variant="paragraph" className="text-blue-gray-900 mt-1">
                                {post.user?.fullName || 'N/A'}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="small" className="font-bold text-blue-gray-500">
                                Created At:
                            </Typography>
                            <Typography variant="paragraph" className="text-blue-gray-900 mt-1">
                                {post.createdAt}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="small" className="font-bold text-blue-gray-500">
                                Status:
                            </Typography>
                            <Chip
                                variant="gradient"
                                color={post.status === "ACTIVE" ? "green" : "red"}
                                value={post.status === "ACTIVE" ? "ACTIVE" : "DELETED"}
                                className="py-0.5 px-2 text-[11px] font-medium w-fit mt-1"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <Typography variant="small" className="font-bold text-blue-gray-500 mb-2">
                            Content:
                        </Typography>
                        <div className="bg-blue-gray-50 p-4 rounded-lg">
                            <Typography variant="paragraph" className="text-blue-gray-800 whitespace-pre-wrap">
                                {post.content}
                            </Typography>
                        </div>
                        {postFiles.length > 0 && (
                            <div className="mt-6">
                                <Typography variant="small" className="font-bold text-blue-gray-500 mb-2">
                                    Attachments:
                                </Typography>
                                <ul className="space-y-2">
                                    {postFiles.map((file, index) => (
                                        <li key={index} className="text-blue-600 underline text-sm">
                                            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                                                {file.fileName}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>

                    {/* Nút và danh sách comment */}
                    <div className="mt-6">
                        <Button
                            onClick={() => setShowComments(prev => !prev)}
                            color="blue"
                            variant="outlined"
                            size="sm"
                        >
                            {showComments ? "Hide Comments" : "View All Comments"}
                        </Button>

                        {showComments && (
                            <div className="mt-4 space-y-4">
                                {/* Bộ lọc tìm kiếm comment */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Content search */}
                                    <div className="flex flex-col">
                                        <label className="text-xs text-gray-600 mb-1">Search content</label>
                                        <input
                                            type="text"
                                            placeholder="Content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                        />
                                    </div>

                                    {/* Search by user name */}
                                    <div className="flex flex-col">
                                        <label className="text-xs text-gray-600 mb-1">User name</label>
                                        <input
                                            type="text"
                                            placeholder="Name of user"
                                            value={userFullName}
                                            onChange={(e) => setUserFullName(e.target.value)}
                                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-xs text-gray-600 mb-1">Status</label>
                                        <select
                                            value={commentStatus}
                                            onChange={(e) => setCommentStatus(e.target.value)}
                                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                        >
                                            <option value="">All</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="DELETED">Deleted</option>
                                        </select>
                                    </div>

                                    {/* Sort order */}
                                    <div className="flex flex-col">
                                        <label className="text-xs text-gray-600 mb-1">Order</label>
                                        <select
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(e.target.value)}
                                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                        >
                                            <option value="DESC">Newest</option>
                                            <option value="ASC">Oldest</option>
                                        </select>
                                    </div>
                                </div>

                                {commentList.map(comment => (
                                    <div
                                        key={comment.commentId}
                                        className="p-4 bg-blue-gray-50 rounded-lg shadow-sm border border-gray-200"
                                    >
                                        <Typography variant="small" className="font-bold text-blue-gray-700">
                                            {comment.user.fullName}
                                        </Typography>
                                        <Typography variant="paragraph" className="text-blue-gray-800">
                                            {comment.content}
                                        </Typography>
                                        <Typography variant="small" className="text-blue-gray-400 text-xs mb-2">
                                            {comment.createdAt}
                                        </Typography>

                                        <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                                            <span>
                Status: <span className={`font-medium ${comment.status === "ACTIVE" ? "text-green-600" : "text-red-500"}`}>
                    {comment.status}
                </span>
            </span>

                                            <button
                                                onClick={() => handleActionOfComment(comment.commentId, comment.status)}
                                                className={`px-2 py-1 border rounded text-xs font-semibold transition-all duration-200
                    ${comment.status === "ACTIVE"
                                                    ? "text-red-600 border-red-600 hover:bg-red-50"
                                                    : "text-green-600 border-green-600 hover:bg-green-50"}`}
                                            >
                                                {comment.status === "ACTIVE" ? "Delete" : "Activate"}
                                            </button>
                                        </div>
                                    </div>
                                ))}

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
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                        <button
                            onClick={() => changeStatus(post.postId, post.status)}
                            className={`text-xs font-semibold px-3 py-1 rounded hover:bg-opacity-10 border 
                                ${post.status === "ACTIVE"
                                ? "text-red-600 border-red-600 hover:bg-red-50"
                                : "text-green-400 border-green-400 hover:bg-green-50"}`}>
                            {post.status === "ACTIVE" ? 'Delete post' : 'Active post'}
                        </button>
                        <button
                            onClick={() => navigate(-1)} color="light-blue"
                            className="text-xs font-semibold text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-red-50">
                            Go back
                        </button>
                    </div>

                </CardBody>
            </Card>
        </div>
    );
}

export default PostDetail;