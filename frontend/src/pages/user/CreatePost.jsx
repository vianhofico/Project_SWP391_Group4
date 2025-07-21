import React, {useState, useEffect} from 'react';
import {getAllPostTopics} from "@/api/postTopicApi";
import {useNavigate, useParams} from "react-router-dom";
import {createPost, editPost, getFilesByPostId, getPostById} from "@/api/postApi.js";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [postTopicId, setPostTopicId] = useState("");
    const [topics, setTopics] = useState([]);
    const [files, setFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const navigate = useNavigate();
    const {postId} = useParams();
    const [removedFiles, setRemovedFiles] = useState([]);

    useEffect(() => {
        const fetchPostToEdit = async () => {
            try {
                const res = await getPostById(postId);
                const data = res.data;
                setTitle(data.title);
                setContent(data.content);
                setPostTopicId(data.postTopic?.postTopicId || "");
            } catch (error) {
                console.error("Lỗi khi tải bài viết để chỉnh sửa:", error);
            }
        };
        if (postId) fetchPostToEdit();
    }, [postId]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await getAllPostTopics();
                setTopics(res.data);
            } catch (err) {
                console.error("Lỗi tải chủ đề:", err);
            }
        };
        fetchTopics();
    }, []);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await getFilesByPostId(postId);
                setExistingFiles(res.data);
            } catch (error) {
                console.error("error when fetch files by post id: " + error);
            }
        };
        if (postId) fetchFiles();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const post = {
            title,
            content,
            postTopicId,
        };

        const formData = new FormData();
        formData.append(
            "post",
            new Blob([JSON.stringify(post)], {type: "application/json"})
        );

        files.forEach((file) => {
            formData.append("files", file);
        });

        if (removedFiles.length > 0) {
            formData.append(
                "removedFileIds",
                new Blob([JSON.stringify(removedFiles)], {type: "application/json"})
            );
        }

        try {
            if (postId) {
                await editPost(postId, formData);
                alert("Edit successfully!");
                navigate(`/user/forum/${postId}`);
            } else {
                await createPost(formData);
                alert("Post successfully!");
                navigate("/user/forum");
            }
        } catch (err) {
            console.error("Lỗi khi lưu bài viết:", err);
        }
    };

    const handleRemoveNewFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveFile = (file) => {
        setRemovedFiles(prev => [...prev, file.postFileId]);
        setExistingFiles(prev => prev.filter(f => f.fileUrl !== file.fileUrl));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Forum Header Bar */}
            <div className="bg-blue-600 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate("/user/forum")}
                                className="flex items-center text-white hover:text-blue-200 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Forum
                            </button>
                        </div>
                        <h1 className="text-xl font-bold text-white">
                            {postId ? "Edit Post" : "Create New Post"}
                        </h1>
                        <div></div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Main Content Area */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Post Header */}
                    <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-blue-800">
                                    {postId ? "Editing Post" : "New Post"}
                                </h2>
                                <p className="text-blue-600 text-sm">
                                    {postId ? "Make changes to your existing post" : "Share your thoughts with the community"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-6">
                            {/* Post Title */}
                            <div className="forum-field">
                                <div className="flex items-center mb-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                    <label className="text-gray-800 font-semibold">Post Title</label>
                                    <span className="text-red-500 ml-1">*</span>
                                </div>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Enter your post title..."
                                    className="w-full border-2 border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                                />
                            </div>

                            {/* Topic Selection */}
                            <div className="forum-field">
                                <div className="flex items-center mb-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                    <label className="text-gray-800 font-semibold">Topic Category</label>
                                    <span className="text-red-500 ml-1">*</span>
                                </div>
                                <select
                                    value={postTopicId}
                                    onChange={(e) => setPostTopicId(e.target.value)}
                                    required
                                    className="w-full border-2 border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all bg-white"
                                >
                                    <option value="">-- Choose a category --</option>
                                    {topics.map((topic) => (
                                        <option key={topic.postTopicId} value={topic.postTopicId}>
                                            📋 {topic.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Post Content */}
                            <div className="forum-field">
                                <div className="flex items-center mb-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                    <label className="text-gray-800 font-semibold">Post Content</label>
                                    <span className="text-red-500 ml-1">*</span>
                                </div>
                                <textarea
                                    rows="10"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    placeholder="Write your post content here..."
                                    className="w-full border-2 border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all resize-vertical"
                                />
                                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                                    <span>Use clear and descriptive language</span>
                                    <span>{content.length} characters</span>
                                </div>
                            </div>

                            {/* File Attachments */}
                            <div className="forum-field">
                                <div className="flex items-center mb-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                    <label className="text-gray-800 font-semibold">Attachments</label>
                                    <span className="text-gray-500 text-sm ml-2">(optional)</span>
                                </div>

                                {/* File Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => {
                                            const newFiles = Array.from(e.target.files);
                                            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
                                        }}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                                            Click to upload files
                                        </span>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Supports: Images, Documents, Archives (Max 10MB each)
                                        </p>
                                    </label>
                                </div>

                                {/* Existing Files */}
                                {existingFiles.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Current Files ({existingFiles.length})
                                        </h4>
                                        <div className="bg-green-50 border border-green-200 rounded-md p-3 space-y-2">
                                            {existingFiles.map((file, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-white rounded p-2 shadow-sm">
                                                    <a
                                                        href={file.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                        </svg>
                                                        {file.fileName}
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(file)}
                                                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-all"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Files */}
                                {files.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Files to Upload ({files.length})
                                        </h4>
                                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 space-y-2">
                                            {files.map((file, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-white rounded p-2 shadow-sm">
                                                    <div className="flex items-center text-gray-700">
                                                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span>{file.name}</span>
                                                        <span className="text-gray-500 text-sm ml-2">
                                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewFile(idx)}
                                                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-all"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    <span className="text-red-500">*</span> Required fields
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/user/forum")}
                                        className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all shadow-sm hover:shadow-md"
                                    >
                                        {postId ? "Update Post" : "Publish Post"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;