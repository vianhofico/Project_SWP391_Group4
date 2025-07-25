import React, {useState, useEffect} from 'react';
import {getAllPostTopics} from "@/lib/postTopicApi";
import {useNavigate, useParams} from "react-router-dom";
import {createPost, editPost, getFilesByPostId, getPostById} from "@/lib/postApi.js";

// Custom CSS styles
const customStyles = `
.forum-header {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.forum-field {
    margin-bottom: 1.5rem;
}

.file-upload-area {
    border: 2px dashed #dee2e6;
    transition: all 0.3s ease;
}

.file-upload-area:hover {
    border-color: #007bff;
    background-color: #f8f9ff;
}

.character-count {
    font-size: 0.875rem;
    color: #6c757d;
}

.file-item {
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-remove {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    transition: all 0.2s ease;
}

.btn-remove:hover {
    background-color: #f8d7da;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.back-button {
    transition: all 0.2s ease;
}

.back-button:hover {
    color: #b3d7ff !important;
}

.post-header-icon {
    width: 40px;
    height: 40px;
    background-color: #007bff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.field-indicator {
    width: 8px;
    height: 8px;
    background-color: #007bff;
    border-radius: 50%;
    margin-right: 0.5rem;
}

.file-section {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1rem;
}

.existing-files {
    background-color: #d1edff;
    border: 1px solid #b8daff;
}

.new-files {
    background-color: #e7f3ff;
    border: 1px solid #bee5eb;
}

.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5);
}

.modal {
    z-index: 1050;
}

.modal-content {
    border: none;
    border-radius: 1rem;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.modal-header {
    border-bottom: 1px solid #e9ecef;
    border-radius: 1rem 1rem 0 0;
}

.modal-footer {
    border-top: 1px solid #e9ecef;
    border-radius: 0 0 1rem 1rem;
}

.error-details {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    max-height: 200px;
    overflow-y: auto;
}

.success-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    background-color: #d1edff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.error-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    background-color: #f8d7da;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Success Modal Component
const SuccessModal = ({ show, onClose, title, message, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{zIndex: 1050}}>
            <div className="modal-backdrop fade show"></div>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-success text-white">
                        <h5 className="modal-title d-flex align-items-center">
                            <svg className="me-2" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {title}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body text-center py-4">
                        <div className="success-icon">
                            <svg className="text-success" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="mb-0">{message}</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-success" onClick={onConfirm}>
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Error Modal Component
const ErrorModal = ({ show, onClose, title, message, errorDetails }) => {
    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{zIndex: 1050}}>
            <div className="modal-backdrop fade show"></div>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-danger text-white">
                        <h5 className="modal-title d-flex align-items-center">
                            <svg className="me-2" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {title}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body text-center py-4">
                        <div className="error-icon">
                            <svg className="text-danger" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="mb-3">{message}</p>

                        {errorDetails && (
                            <div className="text-start">
                                <h6 className="fw-bold text-danger mb-2">Error Details:</h6>
                                <div className="error-details">
                                    {typeof errorDetails === 'object' ? (
                                        <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
                                    ) : (
                                        <p className="mb-0">{errorDetails}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-danger" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Loading Overlay Component
const LoadingOverlay = ({ show, message = "Processing..." }) => {
    if (!show) return null;

    return (
        <div className="loading-overlay">
            <div className="text-center">
                <div className="spinner mb-3"></div>
                <p className="text-muted">{message}</p>
            </div>
        </div>
    );
};

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [postTopicId, setPostTopicId] = useState("");
    const [topics, setTopics] = useState([]);
    const [files, setFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [removedFiles, setRemovedFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal states
    const [successModal, setSuccessModal] = useState({
        show: false,
        title: "",
        message: ""
    });
    const [errorModal, setErrorModal] = useState({
        show: false,
        title: "",
        message: "",
        errorDetails: null
    });

    const navigate = useNavigate();
    const {postId} = useParams();

    useEffect(() => {
        const fetchPostToEdit = async () => {
            try {
                const res = await getPostById(postId);
                const data = res.data;
                setTitle(data.title);
                setContent(data.content);
                setPostTopicId(data.postTopic?.postTopicId || "");
            } catch (error) {
                console.error("Error loading post for editing:", error);
                showErrorModal("Failed to Load Post", "Unable to load the post for editing. Please try again.", error.response?.data);
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
                console.error("Error loading topics:", err);
                showErrorModal("Failed to Load Topics", "Unable to load post categories. Please refresh the page.", err.response?.data);
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
                console.error("Error fetching files by post id:", error);
                showErrorModal("Failed to Load Files", "Unable to load existing files. Please try again.", error.response?.data);
            }
        };
        if (postId) fetchFiles();
    }, [postId]);

    const showSuccessModal = (title, message) => {
        setSuccessModal({
            show: true,
            title,
            message
        });
    };

    const showErrorModal = (title, message, errorDetails = null) => {
        setErrorModal({
            show: true,
            title,
            message,
            errorDetails
        });
    };

    const closeSuccessModal = () => {
        setSuccessModal({ show: false, title: "", message: "" });
    };

    const closeErrorModal = () => {
        setErrorModal({ show: false, title: "", message: "", errorDetails: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
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

            if (postId) {
                await editPost(postId, formData);
                showSuccessModal(
                    "Post Updated Successfully!",
                    "Your post has been updated and is now live in the forum."
                );
            } else {
                await createPost(formData);
                showSuccessModal(
                    "Post Published Successfully!",
                    "Your post has been published and is now visible to the community."
                );
            }
        } catch (err) {
            console.error("Error saving post:", err);

            // Extract error details from backend response
            const errorResponse = err.response?.data;
            let errorMessage = "An unexpected error occurred while saving your post.";
            let errorDetails = null;

            if (errorResponse) {
                // Handle different types of error responses
                if (typeof errorResponse === 'string') {
                    errorMessage = errorResponse;
                } else if (errorResponse.message) {
                    errorMessage = errorResponse.message;
                } else if (errorResponse.error) {
                    errorMessage = errorResponse.error;
                }

                // Include additional error details
                errorDetails = errorResponse;
            } else if (err.message) {
                errorMessage = err.message;
            }

            showErrorModal(
                postId ? "Failed to Update Post" : "Failed to Publish Post",
                errorMessage,
                errorDetails
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessConfirm = () => {
        closeSuccessModal();
        if (postId) {
            navigate(`/user/forum/${postId}`);
        } else {
            navigate("/user/forum");
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
        <>
            <style>{customStyles}</style>

            {/* Loading Overlay */}
            <LoadingOverlay
                show={loading}
                message={postId ? "Updating your post..." : "Publishing your post..."}
            />

            {/* Success Modal */}
            <SuccessModal
                show={successModal.show}
                onClose={closeSuccessModal}
                title={successModal.title}
                message={successModal.message}
                onConfirm={handleSuccessConfirm}
            />

            {/* Error Modal */}
            <ErrorModal
                show={errorModal.show}
                onClose={closeErrorModal}
                title={errorModal.title}
                message={errorModal.message}
                errorDetails={errorModal.errorDetails}
            />

            <div className="min-vh-100 bg-light">
                {/* Forum Header Bar */}
                <div className="forum-header shadow-sm">
                    <div className="container-fluid" style={{ maxWidth: '1140px' }}>
                        <div className="py-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <button
                                        onClick={() => navigate("/user/forum")}
                                        className="btn btn-link text-white text-decoration-none back-button p-0"
                                    >
                                        <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Back to Forum
                                    </button>
                                </div>
                                <h1 className="h5 fw-bold text-white mb-0">
                                    {postId ? "Edit Post" : "Create New Post"}
                                </h1>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container py-4" style={{ maxWidth: '900px' }}>
                    {/* Main Content Area */}
                    <div className="card shadow-sm border-0">
                        {/* Post Header */}
                        <div className="card-header bg-primary bg-opacity-10 border-bottom border-primary border-opacity-25">
                            <div className="d-flex align-items-center">
                                <div className="post-header-icon me-3">
                                    <svg className="text-white" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="h6 fw-semibold text-primary mb-1">
                                        {postId ? "Editing Post" : "New Post"}
                                    </h2>
                                    <p className="text-primary small mb-0">
                                        {postId ? "Make changes to your existing post" : "Share your thoughts with the community"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                {/* Post Title */}
                                <div className="forum-field">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="field-indicator"></div>
                                        <label className="form-label fw-semibold text-dark mb-0">Post Title</label>
                                        <span className="text-danger ms-1">*</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        placeholder="Enter your post title..."
                                        className="form-control form-control-lg border-2"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Topic Selection */}
                                <div className="forum-field">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="field-indicator"></div>
                                        <label className="form-label fw-semibold text-dark mb-0">Topic Category</label>
                                        <span className="text-danger ms-1">*</span>
                                    </div>
                                    <select
                                        value={postTopicId}
                                        onChange={(e) => setPostTopicId(e.target.value)}
                                        required
                                        className="form-select form-select-lg border-2"
                                        disabled={loading}
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
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="field-indicator"></div>
                                        <label className="form-label fw-semibold text-dark mb-0">Post Content</label>
                                        <span className="text-danger ms-1">*</span>
                                    </div>
                                    <textarea
                                        rows="10"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                        placeholder="Write your post content here..."
                                        className="form-control border-2"
                                        style={{ resize: 'vertical' }}
                                        disabled={loading}
                                    />
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <span className="character-count">Use clear and descriptive language</span>
                                        <span className="character-count">{content.length} characters</span>
                                    </div>
                                </div>

                                {/* File Attachments */}
                                <div className="forum-field">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="field-indicator"></div>
                                        <label className="form-label fw-semibold text-dark mb-0">Attachments</label>
                                        <span className="text-muted small ms-2">(optional)</span>
                                    </div>

                                    {/* File Upload Area */}
                                    <div className="file-upload-area rounded p-4 text-center">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(e) => {
                                                const newFiles = Array.from(e.target.files);
                                                setFiles((prevFiles) => [...prevFiles, ...newFiles]);
                                            }}
                                            className="d-none"
                                            id="file-upload"
                                            disabled={loading}
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer d-block">
                                            <svg className="text-muted mb-2" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <div className="text-primary fw-medium">
                                                Click to upload files
                                            </div>
                                            <p className="text-muted small mt-1 mb-0">
                                                Supports: Images, Documents, Archives (Max 10MB each)
                                            </p>
                                        </label>
                                    </div>

                                    {/* Existing Files */}
                                    {existingFiles.length > 0 && (
                                        <div className="file-section existing-files mt-3">
                                            <h6 className="fw-medium text-dark mb-2 d-flex align-items-center">
                                                <svg className="me-2 text-success" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Current Files ({existingFiles.length})
                                            </h6>
                                            <div>
                                                {existingFiles.map((file, idx) => (
                                                    <div key={idx} className="file-item d-flex align-items-center justify-content-between">
                                                        <a
                                                            href={file.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="d-flex align-items-center text-decoration-none text-dark"
                                                        >
                                                            <svg className="me-2 text-success" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                            </svg>
                                                            {file.fileName}
                                                        </a>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveFile(file)}
                                                            className="btn btn-outline-danger btn-sm btn-remove"
                                                            disabled={loading}
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
                                        <div className="file-section new-files mt-3">
                                            <h6 className="fw-medium text-dark mb-2 d-flex align-items-center">
                                                <svg className="me-2 text-primary" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Files to Upload ({files.length})
                                            </h6>
                                            <div>
                                                {files.map((file, idx) => (
                                                    <div key={idx} className="file-item d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center text-dark">
                                                            <svg className="me-2 text-primary" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span>{file.name}</span>
                                                            <span className="text-muted small ms-2">
                                                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveNewFile(idx)}
                                                            className="btn btn-outline-danger btn-sm btn-remove"
                                                            disabled={loading}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-4 pt-4 border-top">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="small text-muted">
                                            <span className="text-danger">*</span> Required fields
                                        </div>
                                        <div className="d-flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => navigate("/user/forum")}
                                                className="btn btn-outline-secondary"
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        {postId ? "Updating..." : "Publishing..."}
                                                    </>
                                                ) : (
                                                    postId ? "Update Post" : "Publish Post"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreatePost;