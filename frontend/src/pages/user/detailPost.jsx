import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from "react-router-dom";
import {getPostById, getPostComments} from "@/api/postApi.js";
import {deletePost} from "@/api/postApi.js";
import {activateComment, createComment, deleteComment, editComment} from "@/api/commentApi.js";

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
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5"
                                 stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
                            </svg>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5"
                                 stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                            </svg>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5"
                                 stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M7.217 10.907a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zm0 1.575a.675.675 0 110 1.35.675.675 0 010-1.35zm0 0V9.525m0 0h.01M12 9.525h.01M16.783 10.907a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zm0 1.575a.675.675 0 110 1.35.675.675 0 010-1.35zm0 0V9.525m0 0h.01M6.006 21H6a2.25 2.25 0 01-2.25-2.25V6A2.25 2.25 0 016 3.75c1.619 0 3.097 1.128 3.675 2.701.05.145.106.286.167.428M21 6a2.25 2.25 0 00-2.25-2.25h-.006c-1.619 0-3.097 1.128-3.675 2.701a18.724 18.724 0 00-.167.428m0 0V21m0 0h-3.379m3.379 0a2.25 2.25 0 01-2.25 2.25H12m0 0a2.25 2.25 0 01-2.25-2.25H6.006"/>
                            </svg>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5"
                                 stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                            </svg>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5"
                                 stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6 md:p-8">
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

                                            {comment.user?.userId === user?.userId && (<>
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
                                            </>)}
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

        </div>
    </>)
}
export default DetailPost
