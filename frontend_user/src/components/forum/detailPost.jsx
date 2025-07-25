import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from "react-router-dom";
import {deletePost, getTopLevelCommentsByPostId} from "@/lib/postApi.js";
import {createComment, deleteComment, editComment} from "@/lib/commentApi.js";
import {getFilesByPostId, getPostById, getPostComments} from "@/lib/postApi.js";
import {PhotoProvider, PhotoView} from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import {createReport} from "@/lib/reportApi.js";

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

    const customStyles = `
        .bg-gradient-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
        }
        .bg-gradient-light {
            background: linear-gradient(135deg, #f0f8ff 0%, #e6fffa 50%, #f0fdfa 100%);
        }
        .bg-gradient-blue-light {
            background: linear-gradient(135deg, #dbeafe 0%, #cffafe 100%);
        }
        .bg-gradient-avatar {
            background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%);
        }
        .bg-gradient-btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
            transition: all 0.2s ease;
        }
        .bg-gradient-btn-primary:hover {
            background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%);
            transform: scale(1.05);
        }
        .bg-gradient-red {
            background: linear-gradient(135deg, #ef4444 0%, #ec4899 100%);
        }
        .bg-gradient-red:hover {
            background: linear-gradient(135deg, #dc2626 0%, #db2777 100%);
        }
        .avatar-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .avatar-circle-sm {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .avatar-circle-xs {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .btn-floating {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
        }
        .btn-floating:hover {
            transform: scale(1.1);
            box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        }
        .comment-content {
            background-color: #f8fafc;
            padding: 12px;
            border-radius: 8px;
            white-space: pre-wrap;
        }
        .reply-content {
            background-color: #ffffff;
            padding: 12px;
            border-radius: 6px;
            white-space: pre-wrap;
        }
        .sticky-header {
            position: sticky;
            top: 0;
            z-index: 1050;
        }
        .modal-backdrop-custom {
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }
        .text-gradient {
            background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .border-gradient {
            border-left: 4px solid #60a5fa;
        }
        .media-item {
            height: 256px;
            object-fit: cover;
            transition: transform 0.2s ease;
        }
        .media-item:hover {
            transform: scale(1.05);
        }
        .btn-action {
            transition: all 0.2s ease;
            border-radius: 20px;
            padding: 4px 12px;
            font-size: 0.875rem;
        }
        .btn-action:hover {
            transform: translateY(-1px);
        }
    `;

    return (<>
        <style>{customStyles}</style>
        <div className="bg-gradient-light min-vh-100">
            {/* Header */}
            <header className="bg-gradient-primary shadow-lg sticky-header">
                <div className="container py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <button
                                className="btn btn-link text-white p-2 me-3"
                                onClick={() => navigate(-1)}
                                style={{borderRadius: '50%'}}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="2" stroke="currentColor" style={{width: '24px', height: '24px'}}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container py-4">
                <div className="card shadow-lg border-0" style={{borderRadius: '16px'}}>
                    <div className="card-body p-4 p-md-5 position-relative">
                        {/* Report Button */}
                        {post.user?.userId !== user?.userId && (
                            <button
                                onClick={() => setShowReportForm(true)}
                                className="btn bg-gradient-red text-white btn-sm position-absolute top-0 end-0 m-3"
                                style={{borderRadius: '20px'}}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" style={{width: '16px', height: '16px'}} className="me-1">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3 3l1.664 6L3 15l13.775-4.5L15 9l-2.775.5L3 3z"/>
                                </svg>
                                Report
                            </button>
                        )}

                        {/* User Info */}
                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-gradient-avatar avatar-circle text-white fw-bold fs-5 me-3">
                                {post.user?.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h6 className="text-dark fw-semibold mb-1">{post.user?.fullName || 'Anonymous'}</h6>
                                <small className="text-muted">{post.createdAt}</small>
                            </div>
                        </div>

                        {/* Post Title */}
                        <h1 className="display-4 fw-bold text-gradient mb-4">
                            {post.title}
                        </h1>

                        {/* Post Content */}
                        <div className="bg-gradient-blue-light p-4 mb-4 border-gradient" style={{borderRadius: '12px'}}>
                            <div className="text-dark lh-base" style={{whiteSpace: 'pre-wrap'}}>
                                {post.content}
                            </div>
                        </div>

                        {/* File attachments */}
                        <PhotoProvider>
                            <div className="mb-4">
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
                                                <div className="mb-4">
                                                    <h5 className="text-primary fw-semibold mb-3">📎 File attachments:</h5>
                                                    <div className="d-flex flex-column gap-2">
                                                        {normalFiles.map((file, idx) => (
                                                            <div key={`file-${idx}`}
                                                                 className="bg-light p-3 rounded">
                                                                <a
                                                                    href={file.fileUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary text-decoration-none fw-medium d-flex align-items-center"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                         viewBox="0 0 24 24" strokeWidth="1.5"
                                                                         stroke="currentColor" style={{width: '20px', height: '20px'}} className="me-2">
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
                                                    <h5 className="text-primary fw-semibold mb-3">🖼️ Images & Videos:</h5>
                                                    <div className="row g-3">
                                                        {mediaFiles.map((file, idx) => {
                                                            const extension = file.fileName.split('.').pop().toLowerCase();
                                                            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
                                                            const isVideo = ['mp4', 'webm', 'ogg'].includes(extension);

                                                            return (
                                                                <div key={`media-${idx}`} className="col-md-4 col-sm-6">
                                                                    <div className="rounded overflow-hidden shadow">
                                                                        {isImage ? (
                                                                            <PhotoView src={file.fileUrl}>
                                                                                <img
                                                                                    src={file.fileUrl}
                                                                                    alt={file.fileName}
                                                                                    className="w-100 media-item"
                                                                                    style={{cursor: 'zoom-in'}}
                                                                                />
                                                                            </PhotoView>
                                                                        ) : isVideo ? (
                                                                            <video controls className="w-100 media-item">
                                                                                <source src={file.fileUrl}
                                                                                        type={`video/${extension}`}/>
                                                                                Your browser does not support the video tag.
                                                                            </video>
                                                                        ) : null}
                                                                    </div>
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

                        {/* Action buttons for post owner */}
                        {post.user?.userId === user?.userId && (
                            <div className="mt-4 pt-4 border-top d-flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate(`/user/forum/${post.postId}/edit`)}
                                    className="btn bg-gradient-btn-primary text-white fw-semibold d-flex align-items-center"
                                    style={{borderRadius: '20px'}}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" style={{width: '20px', height: '20px'}} className="me-2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
                                    </svg>
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteThisPost(post.postId)}
                                    className="btn btn-outline-danger fw-semibold d-flex align-items-center"
                                    style={{borderRadius: '20px'}}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" style={{width: '20px', height: '20px'}} className="me-2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                    </svg>
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Comments Section */}
                    <div className="bg-gradient-blue-light p-4 p-md-5 border-top">
                        <div className="d-flex align-items-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" style={{width: '24px', height: '24px'}} className="text-primary me-2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zM15.375 12a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                            </svg>
                        </div>

                        {/* Comment input */}
                        <div className="card border-primary mb-4">
                            <textarea
                                className="form-control border-0"
                                style={{height: '128px', resize: 'none', borderRadius: '8px 8px 0 0'}}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your comment..."
                            />
                            <div className="card-footer bg-light border-0 d-flex justify-content-between align-items-center"
                                 style={{borderRadius: '0 0 8px 8px'}}>
                                <div className="text-muted small"></div>
                                <button
                                    onClick={addNewComment}
                                    className="btn bg-gradient-btn-primary text-white fw-semibold btn-sm d-flex align-items-center"
                                    style={{borderRadius: '20px'}}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" style={{width: '16px', height: '16px'}} className="me-1">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                                    </svg>
                                    Send comment
                                </button>
                            </div>
                        </div>

                        {/* Comments list */}
                        <div className="d-flex flex-column gap-4">
                            {commentList.length > 0 ? (
                                commentList.map((comment) => (
                                    <div key={comment.commentId}>
                                        {/* Main Comment */}
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-body p-4">
                                                <div className="d-flex align-items-start">
                                                    {/* Avatar */}
                                                    <div className="bg-gradient-avatar avatar-circle-sm text-white fw-bold flex-shrink-0 me-3">
                                                        {comment.user?.fullName?.charAt(0) || 'U'}
                                                    </div>

                                                    <div className="flex-fill">
                                                        {/* User info */}
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <h6 className="text-primary fw-semibold mb-0">
                                                                {comment.user?.fullName || "Người dùng"}
                                                            </h6>
                                                            <span className="badge bg-light text-dark small">
                                                                {comment.createdAt}
                                                            </span>
                                                        </div>

                                                        {/* Comment content */}
                                                        <div className="comment-content mb-3 text-dark">
                                                            {comment.content}
                                                        </div>

                                                        {/* Action buttons */}
                                                        <div className="d-flex flex-wrap gap-2 small">
                                                            <button
                                                                onClick={() => {
                                                                    setReplyCommentId(comment.commentId);
                                                                    setEditCommentId(null);
                                                                    setNewComment("");
                                                                }}
                                                                className="btn btn-link text-primary btn-action p-1"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                     viewBox="0 0 24 24" strokeWidth="1.5"
                                                                     stroke="currentColor" style={{width: '16px', height: '16px'}} className="me-1">
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
                                                                        className="btn btn-link text-success btn-action p-1"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                             viewBox="0 0 24 24" strokeWidth="1.5"
                                                                             stroke="currentColor" style={{width: '16px', height: '16px'}} className="me-1">
                                                                            <path strokeLinecap="round"
                                                                                  strokeLinejoin="round"
                                                                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
                                                                        </svg>
                                                                        Edit
                                                                    </button>

                                                                    <button
                                                                        onClick={() => handleDelete(comment.commentId)}
                                                                        className="btn btn-link text-danger btn-action p-1"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                             viewBox="0 0 24 24" strokeWidth="1.5"
                                                                             stroke="currentColor" style={{width: '16px', height: '16px'}} className="me-1">
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
                                                                    className="btn btn-link text-warning btn-action p-1"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                         viewBox="0 0 24 24" strokeWidth="1.5"
                                                                         stroke="currentColor" style={{width: '16px', height: '16px'}} className="me-1">
                                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                                              d="M3 3l1.664 6L3 15l13.775-4.5L15 9l-2.775.5L3 3z"/>
                                                                    </svg>
                                                                    Report
                                                                </button>
                                                            )}

                                                            {/* View More/Less button for replies */}
                                                            {comment.replies && comment.replies.filter(reply => reply.status === 'ACTIVE').length > 0 && (
                                                                <button
                                                                    onClick={() => handleToggleReplies(comment.commentId)}
                                                                    className="btn btn-link text-info btn-action p-1"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                         viewBox="0 0 24 24" strokeWidth="1.5"
                                                                         stroke="currentColor" style={{width: '16px', height: '16px'}} className="me-1">
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
                                                            <div className="mt-3 bg-light p-3 rounded">
                                                                <textarea
                                                                    className="form-control border-primary mb-3"
                                                                    placeholder="Write your reply..."
                                                                    value={newComment}
                                                                    onChange={(e) => setNewComment(e.target.value)}
                                                                    rows="3"
                                                                />
                                                                <div className="d-flex gap-2">
                                                                    <button
                                                                        onClick={() => handleReply(comment.commentId)}
                                                                        className="btn btn-primary btn-sm"
                                                                    >
                                                                        Reply
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setReplyCommentId(null);
                                                                            setNewComment("");
                                                                        }}
                                                                        className="btn btn-secondary btn-sm"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Edit textarea */}
                                                        {editCommentId === comment.commentId && (
                                                            <div className="mt-3 bg-success-subtle p-3 rounded">
                                                                <textarea
                                                                    className="form-control border-success mb-3"
                                                                    value={editContent}
                                                                    onChange={(e) => setEditContent(e.target.value)}
                                                                    rows="3"
                                                                />
                                                                <div className="d-flex gap-2">
                                                                    <button
                                                                        onClick={() => handleEdit(comment.commentId)}
                                                                        className="btn btn-success btn-sm"
                                                                    >
                                                                        Update
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditCommentId(null);
                                                                            setEditContent("");
                                                                        }}
                                                                        className="btn btn-secondary btn-sm"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Display replies if expanded */}
                                        {expandedComments.has(comment.commentId) && comment.replies && comment.replies.length > 0 && (
                                            <div className="ms-5 mt-3 d-flex flex-column gap-3">
                                                {comment.replies
                                                    .filter(reply => reply.status === 'ACTIVE')
                                                    .map((reply) => (
                                                        <div key={reply.commentId}
                                                             className="bg-light p-3 rounded border-start border-primary border-3">
                                                            <div className="d-flex align-items-start">
                                                                {/* Reply Avatar */}
                                                                <div className="bg-secondary avatar-circle-xs text-white fw-bold flex-shrink-0 me-3">
                                                                    {reply.user?.fullName?.charAt(0) || 'U'}
                                                                </div>

                                                                <div className="flex-fill">
                                                                    {/* Reply user info */}
                                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                                        <h6 className="text-dark fw-medium mb-0 small">
                                                                            {reply.user?.fullName || "Người dùng"}
                                                                        </h6>
                                                                        <span className="badge bg-white text-muted small">
                                                                            {reply.createdAt}
                                                                        </span>
                                                                    </div>

                                                                    {/* Reply content */}
                                                                    <div className="reply-content text-dark small">
                                                                        {reply.content}
                                                                    </div>

                                                                    {/* Reply action buttons */}
                                                                    <div className="d-flex flex-wrap gap-2 mt-2" style={{fontSize: '0.75rem'}}>
                                                                        {reply.user?.userId === user?.userId ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditCommentId(reply.commentId);
                                                                                        setReplyCommentId(null);
                                                                                        setEditContent(reply.content);
                                                                                    }}
                                                                                    className="btn btn-link text-success btn-action p-1 small"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                                         fill="none"
                                                                                         viewBox="0 0 24 24"
                                                                                         strokeWidth="1.5"
                                                                                         stroke="currentColor"
                                                                                         style={{width: '12px', height: '12px'}} className="me-1">
                                                                                        <path strokeLinecap="round"
                                                                                              strokeLinejoin="round"
                                                                                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
                                                                                    </svg>
                                                                                    Edit
                                                                                </button>

                                                                                <button
                                                                                    onClick={() => handleDelete(reply.commentId)}
                                                                                    className="btn btn-link text-danger btn-action p-1 small"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                                         fill="none"
                                                                                         viewBox="0 0 24 24"
                                                                                         strokeWidth="1.5"
                                                                                         stroke="currentColor"
                                                                                         style={{width: '12px', height: '12px'}} className="me-1">
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
                                                                                className="btn btn-link text-warning btn-action p-1 small"
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                                     fill="none"
                                                                                     viewBox="0 0 24 24" strokeWidth="1.5"
                                                                                     stroke="currentColor"
                                                                                     style={{width: '12px', height: '12px'}} className="me-1">
                                                                                    <path strokeLinecap="round"
                                                                                          strokeLinejoin="round"
                                                                                          d="M3 3l1.664 6L3 15l13.775-4.5L15 9l-2.775.5L3 3z"/>
                                                                                </svg>
                                                                                Report
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                    {/* Edit textarea for reply */}
                                                                    {editCommentId === reply.commentId && (
                                                                        <div className="mt-2 bg-success-subtle p-2 rounded">
                                                                            <textarea
                                                                                className="form-control border-success mb-2 small"
                                                                                value={editContent}
                                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                                rows="2"
                                                                            />
                                                                            <div className="d-flex gap-2">
                                                                                <button
                                                                                    onClick={() => handleEdit(reply.commentId)}
                                                                                    className="btn btn-success btn-sm"
                                                                                    style={{fontSize: '0.75rem'}}
                                                                                >
                                                                                    Update
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditCommentId(null);
                                                                                        setEditContent("");
                                                                                    }}
                                                                                    className="btn btn-secondary btn-sm"
                                                                                    style={{fontSize: '0.75rem'}}
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
                                <div className="text-center py-5">
                                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                         style={{width: '64px', height: '64px'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1.5" stroke="currentColor" style={{width: '32px', height: '32px'}} className="text-primary">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zM15.375 12a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                                        </svg>
                                    </div>
                                    <p className="text-muted fs-5 mb-1">No comment</p>
                                    <p className="text-muted small">Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <nav>
                                    <ul className="pagination">
                                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setPage(Math.max(0, page - 1))}
                                                disabled={page === 0}
                                            >
                                                Prev
                                            </button>
                                        </li>
                                        <li className="page-item active">
                                            <span className="page-link bg-primary border-primary">
                                                {page + 1} / {totalPages}
                                            </span>
                                        </li>
                                        <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                                disabled={page >= totalPages - 1}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button className="btn bg-gradient-btn-primary text-white btn-floating">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                     stroke="currentColor" style={{width: '24px', height: '24px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
            </button>

            {/* Report Modal */}
            {showReportForm && (
                <div className="modal d-block modal-backdrop-custom" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{borderRadius: '16px'}}>
                            {/* Modal Header */}
                            <div className="modal-header bg-gradient-red text-white border-0" style={{borderRadius: '16px 16px 0 0'}}>
                                <h5 className="modal-title d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" style={{width: '24px', height: '24px'}} className="me-2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M3 3l1.664 6L3 15l13.775-4.5L15 9l-2.775.5L3 3z"/>
                                    </svg>
                                    Report
                                </h5>
                                <p className="small mb-0 opacity-75">Help us maintain an active community</p>
                            </div>

                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Reason of report</label>
                                    <select
                                        className="form-select border-2"
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
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
                                </div>

                                {reportType === "OTHER" && (
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Detail</label>
                                        <textarea
                                            className="form-control border-2"
                                            value={reportContent}
                                            onChange={(e) => setReportContent(e.target.value)}
                                            rows={4}
                                            placeholder="Describe the issue in detail..."
                                            style={{resize: 'none'}}
                                        />
                                    </div>
                                )}

                                <div className="d-flex justify-content-end gap-3 mt-4">
                                    <button
                                        onClick={() => {
                                            setShowReportForm(false);
                                            setReportType("");
                                            setReportContent("");
                                            setCommentIdToReport(null)
                                        }}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={makeReport}
                                        disabled={!reportType}
                                        className="btn bg-gradient-red text-white fw-semibold"
                                    >
                                        Send report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>)
}

export default DetailPost