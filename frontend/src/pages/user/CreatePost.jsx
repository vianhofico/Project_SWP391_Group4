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
        <div className="max-w-4xl mx-auto mt-10 px-4 py-8 bg-white shadow-md rounded-xl border border-blue-200">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">
                {postId ? "Edit post" : "Add new post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                    <label className="block text-blue-700 font-semibold mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full border border-blue-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-blue-700 font-semibold mb-2">Content</label>
                    <textarea
                        rows="6"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="w-full border border-blue-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-blue-700 font-semibold mb-2">Topic</label>
                    <select
                        value={postTopicId}
                        onChange={(e) => setPostTopicId(e.target.value)}
                        required
                        className="w-full border border-blue-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Select topic --</option>
                        {topics.map((topic) => (
                            <option key={topic.postTopicId} value={topic.postTopicId}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-blue-700 font-semibold mb-2">Attachment</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => {
                            const newFiles = Array.from(e.target.files);
                            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
                        }}
                    />


                    {/* Existing files */}
                    {existingFiles.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-700 mb-1">📂 Existing files</p>
                            <div className="border border-gray-200 rounded-md p-3 space-y-1 bg-gray-50">
                                {existingFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <a
                                            href={file.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-800 hover:underline break-all text-sm"
                                        >
                                            📎 {file.fileName}
                                        </a>
                                        <button
                                            onClick={() => handleRemoveFile(file)}
                                            className="text-red-500 text-sm hover:underline ml-4"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New files */}
                    {files.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-blue-700 mb-1">🆕 New files to upload</p>
                            <div className="border border-blue-200 rounded-md p-3 space-y-1 bg-blue-50">
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <span className="text-blue-800 text-sm break-all">📎 {file.name}</span>
                                        <button
                                            onClick={() => handleRemoveNewFile(idx)}
                                            className="text-red-500 text-sm hover:underline ml-4"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mt-8">
                        <button
                            type="button"
                            onClick={() => navigate("/user/forum")}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-6 py-2 rounded-md shadow border border-blue-300"
                        >
                            ← Back
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow"
                        >
                            {postId?"Save":"Post"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
