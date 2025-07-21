import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from "react-router-dom";
import {deletePost, getTopLevelCommentsByPostId} from "@/api/postApi.js";
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
    const [expandedComments, setExpandedComments] = useState(new Set());

    const handleToggleReplies = (commentId) => {
        const newExpandedComments = new Set(expandedComments);
        if (newExpandedComments.has(commentId)) {
            newExpandedComments.delete(commentId);
        } else {
            newExpandedComments.add(commentId);
        }
        setExpandedComments(newExpandedComments);
    };

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
        const fetchTopCommentsByPostId = async () => {
            try {
                const res = await getTopLevelCommentsByPostId(postId, {
                    page, size,
                });
                setCommentList(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error("Failed to load comment:", err);
            }
        }
        fetchTopCommentsByPostId();
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">

            <header className="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <button
                            className="text-white hover:text-blue-100 mr-4 p-2 rounded-full hover:bg-white/20 transition-all duration-200"
                            onClick={() => navigate(-1)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-blue-100">
                    <div className="p-6 md:p-8 relative">
                        {post.user?.userId !== user?.userId && (
                            <button
                                onClick={() => setShowReportForm(true)}
                                className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 inline mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3 3l1.664 6L3 15l13.775-4.5L15 9l-2.775.5L3 3z"/>
                                </svg>
                                Report
                            </button>
                        )}

                        <div className="flex items-center mb-6">
                            <div
                                className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                {post.user?.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h3 className="text-gray-800 font-semibold">{post.user?.fullName || 'Anonymous'}</h3>
                                <p className="text-sm text-gray-500">{post.createdAt}</p>
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                            {post.title}
                        </h1>

                        <div
                            className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border-l-4 border-blue-400">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </div>
                        </div>

                        {/* File attachments */}
                        <PhotoProvider>
                            <div className="mb-6">
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
                                            {normalFiles.length > 0 && (
                                                <div className="mb-6">
                                                    <h4 className="text-blue-800 font-semibold mb-3">📎 File
                                                        attachments:</h4>
                                                    <div className="space-y-2">
                                                        {normalFiles.map((file, idx) => (
                                                            <div key={`file-${idx}`}
                                                                 className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 transition-colors duration-200">
                                                                <a
                                                                    href={file.fileUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:text-blue-800 font-medium break-all flex items-center"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                         viewBox="0 0 24 24" strokeWidth="1.5"
                                                                         stroke="currentColor" className="w-5 h-5 mr-2">
                                                                        <path strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                                                                    </svg>
                                                                    {file.fileName}
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {mediaFiles.length > 0 && (
                                                <div>
                                                    <h4 className="text-blue-800 font-semibold mb-3">🖼️ Images &
                                                        Videos:</h4>
                                                    <div
                                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                        {mediaFiles.map((file, idx) => {
                                                            const extension = file.fileName.split('.').pop().toLowerCase();
                                                            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
                                                            const isVideo = ['mp4', 'webm', 'ogg'].includes(extension);

                                                            return (
                                                                <div key={`media-${idx}`}
                                                                     className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                                                                    {isImage ? (
                                                                        <PhotoView src={file.fileUrl}>
                                                                            <img
                                                                                src={file.fileUrl}
                                                                                alt={file.fileName}
                                                                                className="w-full h-64 object-cover cursor-zoom-in hover:scale-105 transition-transform duration-200"
                                                                            />
                                                                        </PhotoView>
                                                                    ) : isVideo ? (
                                                                        <video controls
                                                                               className="w-full max-h-64 object-cover">
                                                                            <source src={file.fileUrl}
                                                                                    type={`video/${extension}`}/>
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                    ) : null}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </PhotoProvider>

                        {/* Action buttons cho chủ bài viết */}
                        {post.user?.userId === user?.userId && (
                            <div className="mt-8 pt-6 border-t border-blue-100 flex flex-wrap items-center gap-3">
                                <button
                                    onClick={() => navigate(`/user/forum/${post.postId}/edit`)}
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-full flex items-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
                                    </svg>
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteThisPost(post.postId)}
                                    className="text-red-600 hover:text-red-700 font-semibold py-3 px-6 rounded-full border-2 border-red-300 hover:border-red-400 hover:bg-red-50 flex items-center transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                    </svg>
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Comments Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 border-t border-blue-100">
                        <div className="flex items-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" className="w-6 h-6 text-blue-600 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zM15.375 12a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                            </svg>
                        </div>

                        {/* Comment input */}
                        <div className="bg-white rounded-xl border-2 border-blue-200 mb-8 shadow-md">
                            <textarea
                                className="w-full h-32 p-4 focus:outline-none resize-none rounded-t-xl placeholder-gray-400"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your comment..."
                            />
                            <div
                                className="p-4 border-t border-blue-100 flex justify-between items-center bg-blue-50 rounded-b-xl">
                                <div className="text-sm text-gray-500">
                                </div>
                                <button
                                    onClick={addNewComment}
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 px-6 rounded-full text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 inline mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                                    </svg>
                                    Send comment
                                </button>
                            </div>
                        </div>

                        {/* Comments list */}
                        <div className="space-y-6">
                            {commentList.length > 0 ? (
                                commentList.map((comment) => (
                                    <div key={comment.commentId}>
                                        {/* Comment chính */}
                                        <div
                                            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-blue-100">
                                            <div className="flex items-start space-x-4">
                                                {/* Avatar */}
                                                <div
                                                    className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {comment.user?.fullName?.charAt(0) || 'U'}
                                                </div>

                                                <div className="flex-1">
                                                    {/* User info */}
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-blue-800 font-semibold">
                                                            {comment.user?.fullName || "Người dùng"}
                                                        </h4>
                                                        <span
                                                            className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {comment.createdAt}
                                </span>
                                                    </div>

                                                    {/* Comment content */}
                                                    <div
                                                        className="text-gray-700 mb-4 leading-relaxed bg-blue-50 p-3 rounded-lg whitespace-pre-wrap">
                                                        {comment.content}
                                                    </div>

                                                    {/* Action buttons */}
                                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                                        <button
                                                            onClick={() => {
                                                                setReplyCommentId(comment.commentId);
                                                                setEditCommentId(null);
                                                                setNewComment("");
                                                            }}
                                                            className="flex items-center text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 px-3 py-1 rounded-full transition-all duration-200"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24" strokeWidth="1.5"
                                                                 stroke="currentColor"
                                                                 className="w-4 h-4 mr-1">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zM15.375 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                                                            </svg>
                                                            Reply
                                                        </button>

                                                        {comment.user?.userId === user?.userId ? (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditCommentId(comment.commentId);
                                                                        setReplyCommentId(null);
                                                                        setEditContent(comment.content);
                                                                    }}
                                                                    className="flex items-center text-green-600 hover:text-green-800 font-medium hover:bg-green-50 px-3 py-1 rounded-full transition-all duration-200"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                         viewBox="0 0 24 24" strokeWidth="1.5"
                                                                         stroke="currentColor" className="w-4 h-4 mr-1">
                                                                        <path strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
                                                                    </svg>
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    onClick={() => handleDelete(comment.commentId)}
                                                                    className="flex items-center text-red-600 hover:text-red-800 font-medium hover:bg-red-50 px-3 py-1 rounded-full transition-all duration-200"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                         viewBox="0 0 24 24" strokeWidth="1.5"
                                                                         stroke="currentColor" className="w-4 h-4 mr-1">
                                                                        <path strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                                    </svg>
                                                                    Delete
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setShowReportForm(true);
                                                                    setCommentIdToReport(comment.commentId)
                                                                }}
                                                                className="flex items-center text-orange-600 hover:text-orange-800 font-medium hover:bg-orange-50 px-3 py-1 rounded-full transition-all duration-200"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                     viewBox="0 0 24 24" strokeWidth="1.5"
                                                                     stroke="currentColor" className="w-4 h-4 mr-1">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          d="M3 3l1.664 6L3 15l13.775-4.5L15 9l-2.775.5L3 3z"/>
                                                                </svg>
                                                                Report
                                                            </button>
                                                        )}

                                                        {/* Nút View More/Less nếu có replies */}
                                                        {comment.replies && comment.replies.filter(reply => reply.status === 'ACTIVE').length > 0 && (
                                                            <button
                                                                onClick={() => handleToggleReplies(comment.commentId)}
                                                                className="flex items-center text-purple-600 hover:text-purple-800 font-medium hover:bg-purple-50 px-3 py-1 rounded-full transition-all duration-200"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                     viewBox="0 0 24 24" strokeWidth="1.5"
                                                                     stroke="currentColor" className="w-4 h-4 mr-1">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          d={expandedComments.has(comment.commentId)
                                                                              ? "M4.5 15.75l7.5-7.5 7.5 7.5"
                                                                              : "M19.5 8.25l-7.5 7.5-7.5-7.5"} />
                                                                </svg>
                                                                {expandedComments.has(comment.commentId)
                                                                    ? `Hide ${comment.replies.filter(reply => reply.status === 'ACTIVE').length} replies`
                                                                    : `View ${comment.replies.filter(reply => reply.status === 'ACTIVE').length} replies`}
                                                            </button>
                                                        )}

                                                    </div>

                                                    {/* Reply textarea */}
                                                    {replyCommentId === comment.commentId && (
                                                        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                                    <textarea
                                        className="w-full border-2 border-blue-200 rounded-lg p-3 mb-3 focus:outline-none focus:border-blue-400 resize-none"
                                        placeholder="Viết phản hồi của bạn..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        rows="3"
                                    />
                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => handleReply(comment.commentId)}
                                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                                                                >
                                                                    Reply
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setReplyCommentId(null);
                                                                        setNewComment("");
                                                                    }}
                                                                    className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all duration-200"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Edit textarea */}
                                                    {editCommentId === comment.commentId && (
                                                        <div className="mt-4 bg-green-50 p-4 rounded-lg">
                                    <textarea
                                        className="w-full border-2 border-green-200 rounded-lg p-3 mb-3 focus:outline-none focus:border-green-400 resize-none"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows="3"
                                    />
                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => handleEdit(comment.commentId)}
                                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                                                                >
                                                                    Update
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditCommentId(null);
                                                                        setEditContent("");
                                                                    }}
                                                                    className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all duration-200"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hiển thị replies nếu được mở rộng */}
                                        {expandedComments.has(comment.commentId) && comment.replies && comment.replies.length > 0 && (
                                            <div className="ml-8 mt-4 space-y-4">
                                                {comment.replies
                                                    .filter(reply => reply.status === 'ACTIVE')
                                                    .map((reply) => (
                                                        <div key={reply.commentId}
                                                             className="bg-gray-50 rounded-lg p-4 shadow-sm border-l-4 border-blue-300">
                                                            <div className="flex items-start space-x-3">
                                                                {/* Avatar reply */}
                                                                <div
                                                                    className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                                    {reply.user?.fullName?.charAt(0) || 'U'}
                                                                </div>

                                                                <div className="flex-1">
                                                                    {/* User info reply */}
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <h5 className="text-gray-700 font-medium text-sm">
                                                                            {reply.user?.fullName || "Người dùng"}
                                                                        </h5>
                                                                        <span
                                                                            className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
                                    {reply.createdAt}
                                </span>
                                                                    </div>

                                                                    {/* Reply content */}
                                                                    <div
                                                                        className="text-gray-600 text-sm leading-relaxed bg-white p-3 rounded-md whitespace-pre-wrap">
                                                                        {reply.content}
                                                                    </div>

                                                                    {/* Reply action buttons */}
                                                                    <div className="flex flex-wrap items-center gap-3 text-xs mt-3">
                                                                        {reply.user?.userId === user?.userId ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditCommentId(reply.commentId);
                                                                                        setReplyCommentId(null);
                                                                                        setEditContent(reply.content);
                                                                                    }}
                                                                                    className="flex items-center text-green-600 hover:text-green-800 font-medium hover:bg-green-50 px-2 py-1 rounded-full transition-all duration-200"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                                         fill="none"
                                                                                         viewBox="0 0 24 24"
                                                                                         strokeWidth="1.5"
                                                                                         stroke="currentColor"
                                                                                         className="w-3 h-3 mr-1">
                                                                                        <path strokeLinecap="round"
                                                                                              strokeLinejoin="round"
                                                                                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
                                                                                    </svg>
                                                                                    Edit
                                                                                </button>

                                                                                <button
                                                                                    onClick={() => handleDelete(reply.commentId)}
                                                                                    className="flex items-center text-red-600 hover:text-red-800 font-medium hover:bg-red-50 px-2 py-1 rounded-full transition-all duration-200"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                                         fill="none"
                                                                                         viewBox="0 0 24 24"
                                                                                         strokeWidth="1.5"
                                                                                         stroke="currentColor"
                                                                                         className="w-3 h-3 mr-1">
                                                                                        <path strokeLinecap="round"
                                                                                              strokeLinejoin="round"
                                                                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                                                    </svg>
                                                                                    Delete
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() => {
                                                                                    setShowReportForm(true);
                                                                                    setCommentIdToReport(reply.commentId)
                                                                                }}
                                                                                className="flex items-center text-orange-600 hover:text-orange-800 font-medium hover:bg-orange-50 px-2 py-1 rounded-full transition-all duration-200"
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                                     fill="none"
                                                                                     viewBox="0 0 24 24" strokeWidth="1.5"
                                                                                     stroke="currentColor"
                                                                                     className="w-3 h-3 mr-1">
                                                                                    <path strokeLinecap="round"
                                                                                          strokeLinejoin="round"
                                                                                          d="M3 3l1.664 6L3 15l13.775-4.5L15 9l-2.775.5L3 3z"/>
                                                                                </svg>
                                                                                Report
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                    {/* Edit textarea cho reply */}
                                                                    {editCommentId === reply.commentId && (
                                                                        <div className="mt-3 bg-green-50 p-3 rounded-lg">
                                    <textarea
                                        className="w-full border-2 border-green-200 rounded-lg p-2 mb-2 focus:outline-none focus:border-green-400 resize-none text-sm"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows="2"
                                    />
                                                                            <div className="flex gap-2">
                                                                                <button
                                                                                    onClick={() => handleEdit(reply.commentId)}
                                                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200"
                                                                                >
                                                                                    Update
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditCommentId(null);
                                                                                        setEditContent("");
                                                                                    }}
                                                                                    className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-all duration-200"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}

                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div
                                        className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-blue-400">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zM15.375 12a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-lg">No comment</p>
                                    <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setPage(Math.max(0, page - 1))}
                                        disabled={page === 0}
                                        className="px-4 py-2 rounded-lg bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        Prev
                                    </button>
                                    <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium">
                                        {page + 1} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                        disabled={page >= totalPages - 1}
                                        className="px-4 py-2 rounded-lg bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-8 right-8">
                <button
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl focus:outline-none transform hover:scale-110 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                         stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                </button>
            </div>

            {/* Report Modal */}
            {showReportForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative transform transition-all duration-300">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-t-2xl">
                            <h2 className="text-xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3 3l1.664 6L3 15l13.775-4.5L15 9l-2.775.5L3 3z"/>
                                </svg>
                                Report
                            </h2>
                            <p className="text-red-100 text-sm mt-1">Help us maintain an active community</p>
                        </div>

                        <div className="p-6">
                            <label className="block mb-3 text-sm font-semibold text-gray-700">Reason of report</label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-red-400 transition-colors duration-200"
                            >
                                <option value="">Choose reason...</option>
                                <option value="SPAM">Spam or misleading content</option>
                                <option value="INAPPROPRIATE_LANGUAGE">Inappropriate language</option>
                                <option value="HARASSMENT">Harassment or hate speech</option>
                                <option value="MISINFORMATION">Misinformation</option>
                                <option value="CHEATING">Cheating</option>
                                <option value="VIOLATES_GUIDELINES">Violates community guidelines</option>
                                <option value="OTHER">Other</option>
                            </select>

                            {reportType === "OTHER" && (
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-semibold text-gray-700">Chi tiết</label>
                                    <textarea
                                        value={reportContent}
                                        onChange={(e) => setReportContent(e.target.value)}
                                        rows={4}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 resize-none focus:outline-none focus:border-red-400 transition-colors duration-200"
                                        placeholder="Mô tả chi tiết vấn đề..."
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowReportForm(false);
                                        setReportType("");
                                        setReportContent("");
                                        setCommentIdToReport(null)
                                    }}
                                    className="px-6 py-3 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 font-medium transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={makeReport}
                                    disabled={!reportType}
                                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                                >
                                    Send report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>)
}

export default DetailPost