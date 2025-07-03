import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from "react-router-dom";
import {deletePost} from "@/api/postApi.js";
import {createComment, deleteComment, editComment} from "@/api/commentApi.js";
import {getFilesByPostId, getPostById, getPostComments} from "@/api/postApi.js";
import {PhotoProvider, PhotoView} from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import {createReport} from "@/api/reportApi.js";


const DetailPost = () => {

    const navigate = useNavigate();
    const {postId} = useParams();
    const [post, setPost] = useState({});
    const [checkChanges, setCheckChanges] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const [newComment, setNewComment] = useState("");
    const [parentCommentId, setParentCommentId] = useState("");
    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [commentList, setCommentList] = useState([]);
    const [replyCommentId, setReplyCommentId] = useState(null);
    const [editCommentId, setEditCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [existingFiles, setExistingFiles] = useState([]);
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportType, setReportType] = useState("");
    const [reportContent, setReportContent] = useState("");
    const [commentIdToReport, setCommentIdToReport] = useState(null);


    const addNewComment = async () => {
        try {
            const commentData = {
                content: newComment, parentCommentId: parentCommentId || null,
            }
            await createComment(postId, commentData);
            setNewComment("");
            setCheckChanges(!checkChanges);
        } catch (error) {
            console.log(error);
            alert("Could not add comment");
        }
    }

    useEffect(() => {
        const fetchCommentsByPostId = async () => {
            try {
                const res = await getPostComments(postId, {
                    page, size,
                });
                setCommentList(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error("Failed to load comment:", err);
            }
        }
        fetchCommentsByPostId();
    }, [postId, checkChanges, page]);

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
        const fetchFiles = async () => {
            try {
                const res = await getFilesByPostId(postId);
                setExistingFiles(res.data);
            } catch (error) {
                console.error("error when fetch files by post id: " + error);
            }
        };
        fetchFiles();
    }, [])


    const deleteThisPost = async (postId) => {
        const confirmText = "Are you sure you want to delete this post?";
        if (!window.confirm(confirmText)) {
            return;
        }
        try {
            await deletePost(postId);
            alert("Delete successfully");
            navigate(-1);
        } catch (err) {
            console.error("Failed to delete post:", err);
            alert("Failed to delete post");
        }
    }

    const handleReply = async (commentId) => {
        if (!newComment.trim()) return;
        try {
            await createComment(postId, {
                content: newComment, parentCommentId: commentId
            });
            setNewComment("");
            setReplyCommentId(null);
            setCheckChanges(!checkChanges);
        } catch (err) {
            console.error("Reply failed", err);
            alert("Reply failed");
        }
    };

    const handleEdit = async (commentId) => {
        if (!editContent.trim()) return;
        try {
            await editComment(commentId, {content: editContent});
            setEditCommentId(null);
            setEditContent("");
            setCheckChanges(!checkChanges);
        } catch (err) {
            console.error("Edit failed", err);
            alert("Edit failed");
        }
    };

    const handleDelete = async (commentId) => {
        let confirmText = "Are you sure to delete this comment?";
        let notification = "Delete sucessfully!"
        if (!window.confirm(confirmText)) return;
        try {
            await deleteComment(commentId);
            setCheckChanges(!checkChanges);
            alert(notification);
        } catch (err) {
            console.log("Error when change status of comment:", err);
        }
    }

    const makeReport = async () => {
        try {
            if (commentIdToReport !== null)
                await createReport({reportType, content: reportContent, postId: null, commentId: commentIdToReport});
            else
                await createReport({reportType, content: reportContent, postId, commentId: null})
            alert("Create report successfully!");
            setShowReportForm(false);
        } catch (err) {
            console.log("Error when create report", err);
        }
    }

    return (<>
        <div className="bg-gray-100">

            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <button href="" className="text-gray-600 hover:text-gray-900 mr-4"
                                onClick={() => navigate(-1)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5"
                                 stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6 md:p-8 relative">
                        {post.user?.userId !== user?.userId && (
                            <button
                                onClick={() => setShowReportForm(true)}
                                className="absolute top-0 right-0 mt-4 mr-4 bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded hover:bg-red-200"
                            >
                                Report
                            </button>
                        )}

                        <div className="flex items-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                 className="w-5 h-5 text-gray-500 mr-2">
                                <path fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
                        <p className="text-sm text-gray-500 mb-4">{post.createdAt}</p>
                        <span
                            className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-6">Feedback</span>

                        <div className="space-y-5 text-gray-700">
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-2">
                                <div className="col-span-1 font-medium text-gray-600">Content</div>
                                <div className="col-span-3 md:col-span-5">
                                    {post.content}
                                </div>
                            </div>

                            <div className="grid grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-2">
                                <div className="col-span-1 font-medium text-gray-600">Author</div>
                                <div className="col-span-3 md:col-span-5">{post.user?.fullName}</div>
                            </div>
                            <PhotoProvider>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {(() => {
                                        const normalFiles = existingFiles.filter(file => {
                                            const ext = file.fileName.split('.').pop().toLowerCase();
                                            return !['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'mp4', 'webm', 'ogg'].includes(ext);
                                        });

                                        const mediaFiles = existingFiles.filter(file => {
                                            const ext = file.fileName.split('.').pop().toLowerCase();
                                            return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'mp4', 'webm', 'ogg'].includes(ext);
                                        });

                                        return (
                                            <>
                                                <div className="space-y-2 mb-6">
                                                    {normalFiles.map((file, idx) => (
                                                        <div key={`file-${idx}`}>
                                                            <a
                                                                href={file.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline break-all"
                                                            >
                                                                📎 {file.fileName}
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>

                                                {mediaFiles.map((file, idx) => {
                                                    const extension = file.fileName.split('.').pop().toLowerCase();
                                                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
                                                    const isVideo = ['mp4', 'webm', 'ogg'].includes(extension);
                                                    const isPdf = extension === 'pdf';

                                                    return (
                                                        <div key={`media-${idx}`} className="text-sm space-y-2">
                                                            {isImage ? (
                                                                <PhotoView src={file.fileUrl}>
                                                                    <img
                                                                        src={file.fileUrl}
                                                                        alt={file.fileName}
                                                                        className="w-full h-64 object-cover rounded-md cursor-zoom-in"
                                                                    />
                                                                </PhotoView>
                                                            ) : isVideo ? (
                                                                <video controls
                                                                       className="w-full max-h-64 rounded-md object-cover">
                                                                    <source src={file.fileUrl}
                                                                            type={`video/${extension}`}/>
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        );
                                    })()}

                                </div>
                            </PhotoProvider>

                        </div>


                        {post.user?.userId === user?.userId && (
                            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center space-x-3">
                                <button
                                    onClick={() => {
                                        navigate(`/user/forum/${post.postId}/edit`)
                                    }}
                                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
                                    </svg>
                                    Edit Post
                                </button>

                                <button
                                    onClick={() => deleteThisPost(post.postId)}
                                    className="text-gray-600 hover:text-red-600 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:border-red-400 flex items-center">
                                    Delete Post
                                </button>
                            </div>)}

                    </div>

                    <div className="p-6 md:p-8 border-t border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Comments</h2>

                        <div className="bg-white rounded-md border border-gray-300 mb-6">
                                <textarea className="w-full h-32 p-3 focus:outline-none resize-y"
                                          value={newComment}
                                          onChange={(e) => setNewComment(e.target.value)}
                                          placeholder="Add your comment..."></textarea>
                            <div
                                className="p-2 border-t border-gray-300 flex justify-between items-center bg-gray-50">
                                <div className="text-xs text-gray-500">
                                </div>
                                <button
                                    onClick={() => addNewComment()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm">
                                    Comment
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {commentList.length > 0 ? (commentList.map((comment) => (<div key={comment.commentId}
                                                                                          className="flex items-start space-x-3 p-4 bg-stone-50 rounded-lg">
                                    <img
                                        src={"https://cdnphoto.dantri.com.vn/Au8icunjIdjAao2SrF0OZWJkRO8=/thumb_w/1360/2025/05/26/jack1-1748272770861.jpg"}
                                        alt="User Avatar"
                                        className="h-10 w-10 rounded-full mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                {comment.user?.fullName || "Người dùng"}
                                            </h4>
                                            <span className="text-xs text-gray-500">{comment.createdAt}</span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                                            {comment.content}
                                        </div>

                                        <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                                            <button onClick={() => {
                                                setReplyCommentId(comment.commentId);
                                                setEditCommentId(null);
                                                setNewComment("");
                                            }} className="hover:text-blue-600 font-bold">
                                                Reply
                                            </button>
                                            {comment.user?.userId === user?.userId ? (
                                                <>
                                                    <button onClick={() => {
                                                        setEditCommentId(comment.commentId);
                                                        setReplyCommentId(null);
                                                        setEditContent(comment.content);
                                                    }} className="hover:text-teal-600 font-bold">
                                                        Edit
                                                    </button>

                                                    <button onClick={() => {
                                                        handleDelete(comment.commentId);
                                                    }} className="hover:text-red-600 font-bold">
                                                        Delete
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setShowReportForm(true);
                                                        setCommentIdToReport(comment.commentId)
                                                    }}
                                                    className="hover:text-yellow-700 font-bold"
                                                >
                                                    Report
                                                </button>
                                            )}

                                        </div>

                                        {/* Reply textarea */}
                                        {replyCommentId === comment.commentId && (<div className="mt-3">
    <textarea
        className="w-full border rounded p-2 mb-2"
        placeholder="Write your reply..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
    />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleReply(comment.commentId)}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                                                    Reply
                                                </button>
                                                <button onClick={() => {
                                                    setReplyCommentId(null);
                                                    setNewComment("");
                                                }} className="text-gray-500 hover:text-gray-700 text-sm">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>)}

                                        {/* Edit textarea */}
                                        {editCommentId === comment.commentId && (<div className="mt-3">
                                        <textarea
                                            className="w-full border rounded p-2 mb-2"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                        />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(comment.commentId)}
                                                        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                                                    Update
                                                </button>
                                                <button onClick={() => {
                                                    setEditCommentId(null);
                                                    setEditContent("");
                                                }} className="text-gray-500 hover:text-gray-700 text-sm">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>)}

                                    </div>
                                </div>

                            ))) : (<div className="text-gray-500 text-sm">No comment.</div>)}
                        </div>

                    </div>
                </div>

            </div>

            <footer className="text-center py-8 text-sm text-gray-500">
                <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 hidden md:block">
                    <button
                        className="bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                             stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                        </svg>
                    </button>
                </div>
                &copy; 2025 UnityHub. All rights reserved.
            </footer>

            <script>
                // Add any necessary JavaScript here, e.g., for comment editor functionality
                // or mobile menu toggles if you reuse the full header.
            </script>
            {showReportForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-96 max-w-full p-6 relative">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Post</h2>

                        <label className="block mb-2 text-sm font-medium text-gray-700">Report Type</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none"
                        >
                            <option value="">Select a reason</option>
                            <option value="SPAM">Spam or misleading</option>
                            <option value="INAPPROPRIATE_LANGUAGE">Inappropriate content</option>
                            <option value="HARASSMENT">Harassment or hate speech</option>
                            <option value="MISINFORMATION">Misinformation</option>
                            <option value="CHEATING">Cheating</option>
                            <option value="VIOLATES_GUIDELINES">Violates community guidelines</option>
                            <option value="OTHER">Other</option>
                        </select>

                        {reportType === "OTHER" && (
                            <>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Details</label>
                                <textarea
                                    value={reportContent}
                                    onChange={(e) => setReportContent(e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 resize-y focus:outline-none"
                                    placeholder="Describe the issue..."
                                ></textarea>
                            </>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowReportForm(false);
                                    setReportType("");
                                    setCommentIdToReport(null)
                                }}
                                className="px-4 py-2 rounded text-sm text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
                                onClick={() => {
                                    makeReport()
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    </>)
}
export default DetailPost
