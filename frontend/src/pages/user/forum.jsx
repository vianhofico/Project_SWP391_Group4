import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from "react-router-dom";
import { getAllPostTopics } from "@/api/postTopicApi.js";
import { getPostsByTopicId, getAllPosts } from "@/api/postApi.js";

// Constants
const POSTS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 500;

// Utility function for safe localStorage parsing
const getSafeUserData = () => {
    try {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return null;
    }
};

// Header Component
const ForumHeader = ({ user, isDropdownOpen, setIsDropdownOpen }) => (
    <header className="bg-blue-600 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-extrabold text-white tracking-wide">FORUM</h1>
            </div>

            <div className="flex items-center space-x-6">
                {user ? (
                    <UserDropdown
                        user={user}
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={setIsDropdownOpen}
                    />
                ) : (
                    <AuthLinks />
                )}
            </div>
        </div>
    </header>
);

// User Dropdown Component
const UserDropdown = ({ user, isDropdownOpen, setIsDropdownOpen }) => (
    <div id="user-dropdown" className="relative flex items-center gap-3 text-white">
        <h4 className="font-medium">{user.fullName}</h4>
        <img
            src="https://i.pravatar.cc/150?img=3"
            alt="avatar"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-white hover:border-blue-200 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && (
            <div className="absolute right-0 top-12 bg-white text-blue-700 rounded-lg shadow-lg z-10 min-w-[150px]">
                <Link
                    to="/user/profile"
                    className="block px-4 py-2 hover:bg-blue-100 transition-colors"
                >
                    Profile
                </Link>
                <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-100 text-red-600 hover:bg-red-50 transition-colors"
                >
                    Logout
                </button>
            </div>
        )}
    </div>
);

// Auth Links Component
const AuthLinks = () => (
    <div className="space-x-4">
        <Link to="/auth/sign-in" className="text-white hover:text-blue-200 transition-colors">
            Login
        </Link>
        <Link to="/auth/sign-up" className="text-white hover:text-blue-200 transition-colors">
            Register
        </Link>
    </div>
);

// Banner Component
const ForumBanner = () => (
    <div className="w-full h-[300px] md:h-[400px] overflow-hidden relative shadow-lg">
        <img
            src="https://cdnphoto.dantri.com.vn/Au8icunjIdjAao2SrF0OZWJkRO8=/thumb_w/1360/2025/05/26/jack1-1748272770861.jpg"
            alt="Forum Banner"
            className="w-full h-full object-cover brightness-90"
            loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent"></div>
    </div>
);

// Search and Filter Component
const SearchAndFilter = ({ searchTerm, setSearchTerm, topics, postTopicId, setPostTopicId }) => (
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
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-blue-700 placeholder-blue-400 transition duration-200"
            />
        </div>

        <div>
            <h3 className="text-sm font-semibold text-blue-600 mb-3">Topics</h3>
            <div className="flex flex-wrap gap-3">
                <TopicButton
                    isActive={postTopicId === 0}
                    onClick={() => setPostTopicId(0)}
                    label="All Posts"
                />
                {topics.map((topic) => (
                    <TopicButton
                        key={topic.postTopicId}
                        isActive={postTopicId === topic.postTopicId}
                        onClick={() => setPostTopicId(topic.postTopicId)}
                        label={topic.name}
                    />
                ))}
            </div>
        </div>
    </div>
);

// Topic Button Component
const TopicButton = ({ isActive, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105
            ${isActive
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-100 hover:border-blue-400"}
        `}
    >
        {label}
    </button>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
    <div className="space-y-12">
        {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg border border-blue-100">
                <div className="animate-pulse">
                    <div className="h-6 bg-blue-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-orange-200 rounded w-20 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-lg font-medium">Something went wrong</p>
            <p className="text-sm">{message}</p>
        </div>
        <button
            onClick={onRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
            Try Again
        </button>
    </div>
);

// Empty State Component
const EmptyState = () => (
    <div className="text-center py-16">
        <svg className="mx-auto h-24 w-24 text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No posts found</h3>
        <p className="text-gray-500 mb-6">Be the first to start a discussion!</p>
        <Link
            to="/user/forum/newPost"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Post
        </Link>
    </div>
);

// Post Card Component
const PostCard = ({ post }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const formattedDate = dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3');
            return new Date(formattedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'N/A';
        }
    };

    return (
        <Link to={`/user/forum/${post.postId}`}>
            <article className="mb-5 bg-white p-8 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:bg-blue-50 hover:scale-[1.02] group">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-blue-800 group-hover:text-blue-600 transition-colors">
                        {post.title}
                    </h3>
                    <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-4">
                        {post.postTopic?.name || 'Uncategorized'}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm text-blue-700">
                    <div className="md:col-span-1 font-semibold">Content</div>
                    <div className="md:col-span-5 text-gray-600 line-clamp-2">{post.content}</div>

                    <div className="md:col-span-1 font-semibold">Author</div>
                    <div className="md:col-span-5 flex items-center">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                            {(post.user.fullName || 'A')[0].toUpperCase()}
                        </div>
                        {post.user.fullName || 'Anonymous'}
                    </div>

                    <div className="md:col-span-1 font-semibold">Created</div>
                    <div className="md:col-span-5 text-gray-500">
                        {formatDate(post.createdAt)}
                    </div>
                </div>
            </article>
        </Link>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const canGoPrev = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    return (
        <div className="flex justify-center items-center gap-4 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canGoPrev}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    canGoPrev
                        ? 'text-blue-600 bg-white border border-blue-300 hover:bg-blue-700 hover:text-white hover:scale-105'
                        : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                }`}
            >
                Previous
            </button>

            <div className="px-4 py-2 rounded-lg bg-blue-800 text-white text-sm font-semibold">
                {currentPage + 1} / {totalPages || 1}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canGoNext}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    canGoNext
                        ? 'text-blue-600 bg-white border border-blue-300 hover:bg-blue-700 hover:text-white hover:scale-105'
                        : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                }`}
            >
                Next
            </button>
        </div>
    );
};

// Logout handler
const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.reload();
    }
};

// Custom hook for debounced search
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Main Forum Component
const Forum = () => {
    // State management
    const [posts, setPosts] = useState([]);
    const [topics, setTopics] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [postTopicId, setPostTopicId] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Memoized user data
    const user = useMemo(() => getSafeUserData(), []);

    // Debounced search term
    const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_MS);

    // Click outside handler for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest("#user-dropdown")) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isDropdownOpen]);

    // Fetch posts function
    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = { page, size: POSTS_PER_PAGE };
            const response = postTopicId === 0
                ? await getAllPosts(params)
                : await getPostsByTopicId(postTopicId, params);

            setPosts(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts. Please try again.');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, [postTopicId, page]);

    // Fetch topics function
    const fetchTopics = useCallback(async () => {
        try {
            const response = await getAllPostTopics();
            setTopics(response.data || []);
        } catch (err) {
            console.error('Error fetching topics:', err);
            // Don't show error for topics as it's not critical
        }
    }, []);

    // Effects
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        fetchTopics();
    }, [fetchTopics]);

    // Reset page when topic changes
    useEffect(() => {
        setPage(0);
    }, [postTopicId]);

    // Filter posts by search term
    const filteredPosts = useMemo(() => {
        if (!debouncedSearchTerm) return posts;

        return posts.filter(post =>
            post.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            post.content?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            post.user?.fullName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [posts, debouncedSearchTerm]);

    // Handlers
    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleTopicChange = useCallback((topicId) => {
        setPostTopicId(topicId);
        setPage(0);
    }, []);

    const handleRetry = useCallback(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <>
            <ForumHeader
                user={user}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
            />
            <ForumBanner />

            <main className="container mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-blue-700 tracking-wide">
                        Recent Posts
                    </h2>
                    {user && (
                        <Link
                            to="/user/forum/newPost"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-all duration-200 hover:scale-105 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Post
                        </Link>
                    )}
                </div>

                <SearchAndFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    topics={topics}
                    postTopicId={postTopicId}
                    setPostTopicId={handleTopicChange}
                />

                {/* Content Area */}
                {loading ? (
                    <LoadingSkeleton />
                ) : error ? (
                    <ErrorMessage message={error} onRetry={handleRetry} />
                ) : filteredPosts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-12">
                        {filteredPosts.map((post) => (
                            <PostCard key={post.postId} post={post} />
                        ))}
                    </div>
                )}

                {/* Pagination - only show if not searching and have posts */}
                {!searchTerm && !loading && !error && filteredPosts.length > 0 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </main>
        </>
    );
};

export default Forum;