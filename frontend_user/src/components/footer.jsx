import React from "react";

const Footer = () => {
    return (
        <footer className="footer bg-dark text-white py-5">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-brand">
                            <h3 className="fw-bold mb-3 text-gradient">SWP TEAM</h3>
                            <p className="text-muted mb-4">
                                Empowering learners worldwide with premium educational content
                                and cutting-edge technology solutions.
                            </p>
                            <div className="social-links">
                                <a href="#" className="social-link me-3">
                                    <i className="bi bi-facebook"></i>
                                </a>
                                <a href="#" className="social-link me-3">
                                    <i className="bi bi-twitter"></i>
                                </a>
                                <a href="#" className="social-link me-3">
                                    <i className="bi bi-linkedin"></i>
                                </a>
                                <a href="#" className="social-link me-3">
                                    <i className="bi bi-instagram"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-6">
                        <h5 className="fw-bold mb-3">Quick Links</h5>
                        <ul className="footer-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/courses">Courses</a></li>
                            <li><a href="/forum">Forum</a></li>
                            <li><a href="/about">About Us</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-6">
                        <h5 className="fw-bold mb-3">Categories</h5>
                        <ul className="footer-links">
                            <li><a href="#">Web Development</a></li>
                            <li><a href="#">Mobile Apps</a></li>
                            <li><a href="#">Data Science</a></li>
                            <li><a href="#">Design</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-6">
                        <h5 className="fw-bold mb-3">Support</h5>
                        <ul className="footer-links">
                            <li><a href="/contact">Contact Us</a></li>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-6">
                        <h5 className="fw-bold mb-3">Newsletter</h5>
                        <p className="text-muted small mb-3">
                            Subscribe to get updates on new courses and offers.
                        </p>
                        <div className="newsletter-form">
                            <div className="input-group">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Your email"
                                />
                                <button className="btn btn-primary">
                                    <i className="bi bi-send"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-4 border-secondary" />

                <div className="row align-items-center">
                    <div className="col-md-6">
                        <p className="text-muted small mb-0">
                            © 2024 SWP TEAM. All rights reserved.
                        </p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <p className="text-muted small mb-0">
                            Made with <i className="bi bi-heart-fill text-danger"></i> by SWP391 Group 4
                        </p>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .course-page {
                    padding-top: 80px; /* Account for fixed navbar */
                }

                /* Hero Section */
                .hero-section {
                    min-height: 70vh;
                    display: flex;
                    align-items: center;
                    position: relative;
                }

                .hero-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, 
                        #667eea 0%, 
                        #764ba2 50%, 
                        #f093fb 100%);
                    z-index: 1;
                }

                .hero-background::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
                    z-index: 2;
                }

                .hero-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.2);
                    z-index: 3;
                }

                .text-gradient {
                    background: linear-gradient(45deg, #fff, #f093fb);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-stats {
                    margin-top: 2rem;
                }

                .stat-item {
                    padding: 0 1rem;
                }

                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #fff;
                }

                .stat-label {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.8);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .animate-fade-up {
                    animation: fadeUp 1s ease-out;
                }

                .animate-fade-up-delay {
                    animation: fadeUp 1s ease-out 0.3s both;
                }

                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Courses Section */
                .courses-section {
                    background: #f8f9fa;
                }

                .divider {
                    width: 80px;
                    height: 4px;
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    border-radius: 2px;
                    margin-top: 1rem;
                }

                .course-card {
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    background: #fff;
                }

                .course-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }

                .course-image-wrapper {
                    position: relative;
                    overflow: hidden;
                    height: 220px;
                }

                .course-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                }

                .course-card:hover .course-image {
                    transform: scale(1.1);
                }

                .course-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 2;
                }

                .course-card:hover .course-overlay {
                    opacity: 1;
                }

                .overlay-content {
                    text-align: center;
                    color: white;
                }

                .overlay-content i {
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .enrollment-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 0.5rem 1rem;
                    font-size: 0.85rem;
                    z-index: 3;
                }

                .discount-badge {
                    font-size: 0.75rem;
                    font-weight: 600;
                    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
                }

                .course-title {
                    font-size: 1.25rem;
                    line-height: 1.4;
                    min-height: 3.5rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .course-description {
                    min-height: 4rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    line-height: 1.5;
                }

                .rating-section {
                    min-height: 2rem;
                }

                .rating-text {
                    font-size: 0.9rem;
                }

                .price-section {
                    border-top: 1px solid #eee;
                    padding-top: 1rem;
                }

                .price-current {
                    font-size: 1.5rem;
                }

                .price-original {
                    font-size: 1rem;
                }

                .savings-info {
                    background: rgba(25, 135, 84, 0.1);
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    display: inline-block;
                }

                .add-to-cart-btn {
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    border: none;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .add-to-cart-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                    background: linear-gradient(45deg, #5a6fd8, #6a42a6);
                }

                .owned-btn {
                    background: linear-gradient(45deg, #28a745, #20c997);
                    border: none;
                }

                .view-all-btn {
                    border: 2px solid #007bff;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                }

                .view-all-btn:hover {
                    background: linear-gradient(45deg, #007bff, #6610f2);
                    border-color: transparent;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4);
                }

                /* Footer */
                .footer {
                    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
                }

                .footer-brand .text-gradient {
                    background: linear-gradient(45deg, #fff, #74b9ff);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .footer-links {
                    list-style: none;
                    padding: 0;
                }

                .footer-links li {
                    margin-bottom: 0.5rem;
                }

                .footer-links a {
                    color: #adb5bd;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .footer-links a:hover {
                    color: #fff;
                }

                .social-link {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border-radius: 50%;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .social-link:hover {
                    background: #fff;
                    color: #2c3e50;
                    transform: translateY(-3px);
                }

                .newsletter-form .form-control {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #fff;
                }

                .newsletter-form .form-control::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }

                .newsletter-form .form-control:focus {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: #007bff;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                    color: #fff;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .hero-section {
                        min-height: 60vh;
                        padding: 2rem 0;
                    }

                    .hero-stats {
                        margin-top: 1.5rem;
                    }

                    .stat-number {
                        font-size: 2rem;
                    }

                    .course-image-wrapper {
                        height: 200px;
                    }

                    .course-title {
                        font-size: 1.1rem;
                        min-height: auto;
                    }

                    .course-description {
                        min-height: auto;
                    }

                    .price-current {
                        font-size: 1.25rem;
                    }

                    .container {
                        padding: 0 15px;
                    }

                    .courses-section {
                        padding: 3rem 0;
                    }

                    .footer {
                        padding: 3rem 0;
                    }
                }

                @media (max-width: 576px) {
                    .hero-section {
                        min-height: 50vh;
                    }

                    .display-4 {
                        font-size: 2rem;
                    }

                    .hero-stats {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .stat-item {
                        padding: 0;
                    }

                    .card-body {
                        padding: 1.5rem;
                    }

                    .view-all-btn {
                        padding: 0.75rem 2rem;
                        font-size: 0.9rem;
                    }

                    .footer .row > div {
                        margin-bottom: 2rem;
                    }
                }

                /* Scroll animations */
                @media (min-width: 768px) {
                    .course-card {
                        opacity: 0;
                        transform: translateY(20px);
                        animation: slideInUp 0.6s ease forwards;
                    }

                    .course-card:nth-child(1) { animation-delay: 0.1s; }
                    .course-card:nth-child(2) { animation-delay: 0.2s; }
                    .course-card:nth-child(3) { animation-delay: 0.3s; }
                }

                @keyframes slideInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Loading states */
                .course-card.loading {
                    opacity: 0.7;
                    pointer-events: none;
                }

                .spinner-border-sm {
                    width: 1rem;
                    height: 1rem;
                }

                /* Accessibility improvements */
                .course-card:focus-within {
                    outline: 2px solid #007bff;
                    outline-offset: 2px;
                }

                .btn:focus {
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .courses-section {
                        background: #1a1a1a;
                    }

                    .course-card {
                        background: #2d2d2d;
                        border-color: rgba(255, 255, 255, 0.1);
                    }

                    .course-title,
                    .text-dark {
                        color: #fff !important;
                    }

                    .text-muted {
                        color: #adb5bd !important;
                    }
                }
            `}</style>
        </footer>
    );

};

export default Footer;
