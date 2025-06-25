import React, { useState, useEffect } from 'react';
import { getAllPostTopics } from "@/api/postTopicApi";
import { useNavigate, useParams } from "react-router-dom";
import {createPost, editPost, getPostById} from "@/api/postApi.js";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [postTopicId, setPostTopicId] = useState("");
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();
    const [post, setPost] = useState({});
    const { postId } = useParams();

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
        fetchPostToEdit();
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            title,
            content,
            postTopicId,
        };

        try {
            if (postId) {
                await editPost(postId, postData);
                alert("Edit successfully!");
            } else {
                await createPost(postData);
                alert("Post successfully!");
            }
            navigate("/user/forum");
        } catch (err) {
            console.error("Lỗi khi lưu bài viết:", err);
            alert("Action failure!");
        }
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
                            Post
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
