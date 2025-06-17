import React from 'react';
import {useState, useEffect} from 'react'
import {Link} from "react-router-dom";
import {getAllPostTopics} from "@/api/postTopicApi.js";
import {getPostsByTopicId, getAllPosts} from "@/api/postApi.js";


const Forum = () => {

    const [posts, setPosts] = useState([]);
    const [topics, setTopics] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [postTopicId, setPostTopicId] = useState(0);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = (postTopicId === 0)
                    ? await getAllPosts({page, size})
                    : await getPostsByTopicId(postTopicId, {page, size})

                setPosts(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPosts();
    }, [postTopicId, page]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await getAllPostTopics();
                setTopics(res.data);
            } catch
                (err) {
                console.error(err);
            }
        };
        fetchTopics();
    }, []);

    return (
        <>
            <header className="bg-blue-600 shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="" alt="logo" className="h-8 w-auto mr-3"/>
                        <h1 className="text-3xl font-extrabold text-white tracking-wide">FORUM</h1>
                    </div>
                    <nav className="hidden md:flex space-x-6 text-white font-semibold">
                        <a
                            href="#"
                            className="hover:text-blue-200 transition-colors duration-300"
                        >
                            Home
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-200 transition-colors duration-300"
                        >
                            Top Posts
                        </a>
                    </nav>
                </div>
                <div id="mobile-menu" className="md:hidden bg-blue-700 shadow-inner">
                    <a
                        href="#"
                        className="block px-4 py-3 text-blue-100 hover:bg-blue-800 transition-colors duration-300"
                    >
                        Home
                    </a>
                    <a
                        href="#"
                        className="block px-4 py-3 text-blue-100 hover:bg-blue-800 transition-colors duration-300"
                    >
                        Top Posts
                    </a>
                </div>
            </header>

            {/* Banner */}
            <div className="w-full h-[300px] md:h-[400px] overflow-hidden relative shadow-lg">
                <img
                    src="https://cdnphoto.dantri.com.vn/Au8icunjIdjAao2SrF0OZWJkRO8=/thumb_w/1360/2025/05/26/jack1-1748272770861.jpg"
                    alt="Forum Banner"
                    className="w-full h-full object-cover brightness-90"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent"></div>
            </div>

            <main className="container mx-auto px-4 py-10">
                <h2 className="text-4xl font-bold text-blue-700 mb-8 tracking-wide">
                    Recent Posts
                </h2>

                <div className="mb-10 p-6 bg-blue-50 rounded-xl shadow-md border border-blue-200">
                    <div className="relative mb-5 w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-5 w-5 text-blue-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-blue-700 placeholder-blue-400 transition duration-200"
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-blue-600 mb-3">Topic</h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setPostTopicId(0)}
                                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200
                                    ${postTopicId === 0
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-100"}
                            `}
                            >
                                Newest
                            </button>

                            {topics.map((topic) => {
                                const isActive = postTopicId === topic.postTopicId;
                                return (
                                    <button
                                        onClick={() => setPostTopicId(topic.postTopicId)}
                                        key={topic.postTopicId}
                                        className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200
                                ${isActive
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-100"}
                                        `}
                                    >
                                        {topic.name}
                                    </button>
                                );
                            })}


                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {posts.map((post) => (
                        <Link to={`/user/forum/${post.postId}`} key={post.postId}>
                            <article
                                className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300 hover:bg-blue-50 mb-10"
                            >
                                <h3 className="text-2xl font-bold text-blue-800 mb-3">{post.title}</h3>

                                <span
                                    className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full mb-5">
                {post.postTopic?.name || 'Unknown'}
            </span>

                                <div className="grid grid-cols-6 gap-6 text-sm text-blue-700">
                                    <div className="col-span-1 font-semibold">Content</div>
                                    <div className="col-span-5 truncate">{post.content}</div>

                                    <div className="col-span-1 font-semibold">Author</div>
                                    <div className="col-span-5">{post.user.fullName || 'Anonymous'}</div>

                                    <div className="col-span-1 font-semibold">Created</div>
                                    <div className="col-span-5">
                                        {post.createdAt
                                            ? new Date(post.createdAt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')).toLocaleString()
                                            : 'N/A'}
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Forum;
