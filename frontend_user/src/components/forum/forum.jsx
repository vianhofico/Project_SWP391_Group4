import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from "react-router-dom";
import { getAllPostTopics } from "/src/lib/postTopicApi.js";
import { getPostsByTopicId, getAllPosts } from "/src/lib/postApi.js";
import Footer from "@/components/footer";

// Constants
const POSTS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 500;

// Custom CSS for additional styling (add to your CSS file)
const customStyles = `
.forum-header {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.banner-overlay {
    background: linear-gradient(to top, rgba(13, 110, 253, 0.9) 0%, transparent 50%, transparent 100%);
}

.post-card {
    transition: all 0.3s ease;
    border: 1px solid #dee2e6;
}

.post-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    background-color: #f8f9fa;
}

.topic-btn {
    transition: all 0.2s ease;
}

.topic-btn:hover {
    transform: scale(1.05);
}

.skeleton-shimmer {
    animation: shimmer 2s infinite linear;
    background: linear-gradient(90deg, #f8f9fa 25%, #e9ecef 50%, #f8f9fa 75%);
    background-size: 200% 100%;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
`;

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
    <header className="forum-header shadow-sm">
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 fw-bold text-white m-0">FORUM</h1>
                </div>

                <div className="d-flex align-items-center">
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
        </div>
    </header>
);

// User Dropdown Component
const UserDropdown = ({ user, isDropdownOpen, setIsDropdownOpen }) => (
    <div id="user-dropdown" className="position-relative d-flex align-items-center text-white">
        <h6 className="fw-medium me-3 mb-0">{user.fullName}</h6>
        <img
            src="https://i.pravatar.cc/150?img=3"
            alt="avatar"
            className="rounded-circle border border-2 border-white"
            style={{ width: '40px', height: '40px', cursor: 'pointer' }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && (
            <div className="dropdown-menu show position-absolute end-0" style={{ top: '50px', minWidth: '150px' }}>
                <Link
                    to="/user/profile"
                    className="dropdown-item text-primary"
                >
                    Profile
                </Link>
                <button
                    onClick={handleLogout}
                    className="dropdown-item text-danger"
                >
                    Logout
                </button>
            </div>
        )}
    </div>
);

// Auth Links Component
const AuthLinks = () => (
    <div className="d-flex gap-3">
        <Link to="/auth/sign-in" className="text-white text-decoration-none">
            Login
        </Link>
        <Link to="/auth/sign-up" className="text-white text-decoration-none">
            Register
        </Link>
    </div>
);

// Banner Component
const ForumBanner = () => (
    <div className="position-relative overflow-hidden shadow" style={{ height: '300px' }}>
        <img
            src="https://i.pinimg.com/736x/96/d1/cc/96d1cc416bfc7a2a0a16feb235f1defa.jpg"
            alt="Forum Banner"
            className="w-100 h-100 object-fit-cover"
            style={{ filter: 'brightness(0.9)' }}
            loading="lazy"
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 banner-overlay"></div>
    </div>
);

// Search and Filter Component
const SearchAndFilter = ({ searchTerm, setSearchTerm, topics, postTopicId, setPostTopicId }) => (
    <div className="mb-5 p-4 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-25">
        <div className="position-relative mb-4">
            <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                <svg
                    className="text-primary"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
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
                className="form-control ps-5 py-3 border-primary"
                style={{ paddingLeft: '2.5rem' }}
            />
        </div>

        <div>
            <h6 className="fw-semibold text-primary mb-3">Topics</h6>
            <div className="d-flex flex-wrap gap-2">
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
        className={`btn btn-sm topic-btn ${
            isActive
                ? "btn-primary shadow-sm"
                : "btn-outline-primary"
        }`}
    >
        {label}
    </button>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
    <div className="d-flex flex-column gap-4">
        {[...Array(5)].map((_, index) => (
            <div key={index} className="card shadow-sm border-primary border-opacity-25">
                <div className="card-body p-4">
                    <div className="skeleton-shimmer rounded mb-3" style={{ height: '24px', width: '75%' }}></div>
                    <div className="skeleton-shimmer rounded mb-3" style={{ height: '20px', width: '80px' }}></div>
                    <div className="skeleton-shimmer rounded mb-2" style={{ height: '16px', width: '100%' }}></div>
                    <div className="skeleton-shimmer rounded" style={{ height: '16px', width: '85%' }}></div>
                </div>
            </div>
        ))}
    </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
    <div className="alert alert-danger text-center">
        <div className="mb-3">
            <svg className="mb-2 text-danger" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h5 className="fw-medium">Something went wrong</h5>
            <p className="small mb-0">{message}</p>
        </div>
        <button
            onClick={onRetry}
            className="btn btn-danger"
        >
            Try Again
        </button>
    </div>
);

// Empty State Component
const EmptyState = () => (
    <div className="text-center py-5">
        <svg className="mb-3 text-primary opacity-50" width="96" height="96" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h4 className="fw-medium text-dark mb-2">No posts found</h4>
        <p className="text-muted mb-4">Be the first to start a discussion!</p>
        <Link
            to="/forum/newPost"
            className="btn btn-primary d-inline-flex align-items-center"
        >
            <svg className="me-2" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <Link to={`/forum/${post.postId}`} className="text-decoration-none">
            <article className="card post-card shadow-sm border-primary border-opacity-25 mb-4">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h3 className="h5 fw-bold text-primary mb-0">
                            {post.title}
                        </h3>
                        <span className="badge bg-warning text-dark ms-3 flex-shrink-0">
                            {post.postTopic?.name || 'Uncategorized'}
                        </span>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-2">
                            <strong className="text-primary small">Content</strong>
                        </div>
                        <div className="col-md-10">
                            <p className="text-muted small line-clamp-2 mb-0">{post.content}</p>
                        </div>

                        <div className="col-md-2">
                            <strong className="text-primary small">Author</strong>
                        </div>
                        <div className="col-md-10">
                            <div className="d-flex align-items-center small">
                                <div
                                    className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-2"
                                    style={{ width: '24px', height: '24px', fontSize: '12px' }}
                                >
                                    {(post.user.fullName || 'A')[0].toUpperCase()}
                                </div>
                                <span>{post.user.fullName || 'Anonymous'}</span>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <strong className="text-primary small">Created</strong>
                        </div>
                        <div className="col-md-10">
                            <span className="text-muted small">
                                {formatDate(post.createdAt)}
                            </span>
                        </div>
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
        <nav className="d-flex justify-content-center mt-5">
            <div className="d-flex align-items-center gap-3">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canGoPrev}
                    className={`btn ${canGoPrev ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                >
                    Previous
                </button>

                <div className="bg-primary text-white px-3 py-2 rounded">
                    <small className="fw-semibold">
                        {currentPage + 1} / {totalPages || 1}
                    </small>
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canGoNext}
                    className={`btn ${canGoNext ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                >
                    Next
                </button>
            </div>
        </nav>
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
            <style>{customStyles}</style>

            <ForumBanner />

            <main className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h3 fw-bold text-primary mb-0">
                        Recent Posts
                    </h2>
                    {user && (
                        <Link
                            to="/forum/newPost"
                            className="btn btn-primary d-flex align-items-center gap-2"
                        >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <div>
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
            <Footer/>
        </>
    );
};

export default Forum;