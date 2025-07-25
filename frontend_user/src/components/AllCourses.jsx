import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([
    "Frontend ReactJS",
    "Backend Node.JS",
    "Backend Java",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const navigate = useNavigate();

  const skills = ["Frontend ReactJS", "Backend Node.JS", "Backend Java"];

  useEffect(() => {
    fetchCourses();
    fetchPurchasedCourses();
  }, []);

  const assignCategory = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes("node") || lower.includes("nestjs"))
      return "Backend Node.JS";
    if (lower.includes("spring") || lower.includes("java"))
      return "Backend Java";
    if (lower.includes("react") || lower.includes("redux"))
      return "Frontend ReactJS";
    return "Other";
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/home");
      const data = Array.isArray(res.data) ? res.data : [];
      const withCategory = data.map((course) => ({
        ...course,
        category: assignCategory(course.title || ""),
      }));
      setCourses(withCategory);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const fetchPurchasedCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
          "http://localhost:8080/api/purchased-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );
      setPurchasedCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching purchased courses:", err);
    }
  };

  const handleAddToCart = async (id) => {
    setLoadingId(id);
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Please Login",
        text: "You need to login to perform this action",
        confirmButtonText: "Login Now",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      setLoadingId(null);
      return;
    }

    try {
      await axios.post(
          `http://localhost:8080/api/add-course-to-cart/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      const cartRes = await axios.get("http://localhost:8080/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem("cartItems", JSON.stringify(cartRes.data || []));
      window.dispatchEvent(new Event("cartUpdated"));

      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: "Course has been added to your cart successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Cannot add course to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add course to cart. Please try again.",
      });
    } finally {
      setTimeout(() => setLoadingId(null), 500);
    }
  };

  const handleToggleSkill = (skill) => {
    setSelectedSkills((prev) =>
        prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleClearFilters = () => {
    setSelectedSkills(skills);
    setSearchTerm("");
    setPriceRange([0, 10000000]);
    setSortBy("title");
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
    const matchesCategory = selectedSkills.includes(course.category);
    return matchesSearch && matchesPrice && matchesCategory;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const categorizedCourses = sortedCourses.reduce((acc, course) => {
    const category = course.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(course);
    return acc;
  }, {});

  const renderCourseCard = (course) => {
    const isPurchased = purchasedCourses.includes(course.courseId);
    const rating = Math.round(course.rating || 0);
    const enrolled = course.enrollmentIds?.length || 0;

    return (
        <div key={course.courseId} className="course-card-wrapper">
          <div className="course-card h-100">
            <div className="course-image-container">
              <img
                  src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  className="course-image"
                  alt={course.title}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                  }}
              />
              <div className="course-overlay">
                <button
                    className="preview-btn"
                    onClick={() => navigate(`/courses/${course.courseId}`)}
                >
                  <i className="bi bi-play-circle"></i>
                  Preview
                </button>
              </div>
              <div className="enrollment-badge">
                <i className="bi bi-people"></i>
                {enrolled.toLocaleString()}
              </div>
            </div>

            <div className="course-content">
              <div className="course-category">
                <span className="category-tag">{course.category}</span>
              </div>

              <h5 className="course-title" title={course.title}>
                {course.title}
              </h5>

              <p className="course-description">
                {course.description || "Learn with modern frameworks and cutting-edge technology"}
              </p>

              <div className="course-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                      <i
                          key={i}
                          className={`bi ${
                              i < rating ? "bi-star-fill" : "bi-star"
                          }`}
                      ></i>
                  ))}
                </div>
                <span className="rating-text">
                {course.rating || 0} ({enrolled} students)
              </span>
              </div>

              <div className="course-footer">
                <div className="price-section">
                  <span className="current-price">${course.price.toLocaleString()}</span>
                </div>

                <div className="course-actions">
                  <button
                      className="details-btn"
                      onClick={() => navigate(`/courses/${course.courseId}`)}
                  >
                    <i className="bi bi-eye"></i>
                    View Details
                  </button>

                  {isPurchased ? (
                      <button className="owned-btn" disabled>
                        <i className="bi bi-check-circle"></i>
                        Owned
                      </button>
                  ) : (
                      <button
                          className="add-cart-btn"
                          onClick={() => handleAddToCart(course.courseId)}
                          disabled={loadingId === course.courseId}
                      >
                        {loadingId === course.courseId ? (
                            <>
                              <span className="spinner"></span>
                              Adding...
                            </>
                        ) : (
                            <>
                              <i className="bi bi-cart-plus"></i>
                              Add to Cart
                            </>
                        )}
                      </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  };

  return (
      <div className="all-courses-page">
        {/* Hero Header */}
        <div className="courses-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Explore All Courses</h1>
              <p className="hero-subtitle">
                Discover comprehensive learning paths designed to advance your career
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">{courses.length}+</span>
                  <span className="stat-label">Courses</span>
                </div>
                <div className="stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Students</span>
                </div>
                <div className="stat">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Success Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid courses-content">
          <div className="row">
            {/* Sidebar Filters */}
            <div className="col-lg-3 col-md-4">
              <div className="filters-sidebar">
                <div className="filter-header">
                  <h4>Filters</h4>
                  <button className="clear-filters-btn" onClick={handleClearFilters}>
                    Clear All
                  </button>
                </div>

                {/* Search Filter */}
                <div className="filter-section">
                  <h6>Search Courses</h6>
                  <div className="search-input-wrapper">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Skills Filter */}
                <div className="filter-section">
                  <h6>Skill Categories</h6>
                  <div className="skills-filter">
                    {skills.map((skill) => (
                        <div key={skill} className="skill-checkbox">
                          <input
                              type="checkbox"
                              id={skill}
                              checked={selectedSkills.includes(skill)}
                              onChange={() => handleToggleSkill(skill)}
                          />
                          <label htmlFor={skill}>{skill}</label>
                          <span className="course-count">
                        ({courses.filter(c => c.category === skill).length})
                      </span>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="filter-section">
                  <h6>Price Range</h6>
                  <div className="price-filter">
                    <div className="price-inputs">
                      <input
                          type="number"
                          placeholder="Min"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      />
                      <span>to</span>
                      <input
                          type="number"
                          placeholder="Max"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000000])}
                      />
                    </div>
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="filter-section">
                  <h6>Sort By</h6>
                  <select
                      className="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="title">Title (A-Z)</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                    <option value="rating">Rating (High to Low)</option>
                  </select>
                </div>

                {/* Suggested Courses Button */}
                <div className="filter-section">
                  <button className="suggest-btn">
                    <i className="bi bi-lightbulb"></i>
                    Get Course Suggestions
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8">
              <div className="courses-main">
                {/* Results Header */}
                <div className="results-header">
                  <h3>
                    {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
                  </h3>
                  <p className="results-subtitle">
                    Showing courses matching your criteria
                  </p>
                </div>

                {/* Course Categories */}
                {Object.entries(categorizedCourses).map(([category, courseList]) => {
                  if (courseList.length === 0) return null;

                  return (
                      <div key={category} className="category-section">
                        <div className="category-header">
                          <h4 className="category-title">
                            <i className="bi bi-folder"></i>
                            {category} Learning Path
                          </h4>
                          <span className="course-count-badge">
                        {courseList.length} course{courseList.length !== 1 ? 's' : ''}
                      </span>
                        </div>

                        <div className="courses-grid">
                          {courseList.map((course) => renderCourseCard(course))}
                        </div>
                      </div>
                  );
                })}

                {/* Empty State */}
                {filteredCourses.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <i className="bi bi-search"></i>
                      </div>
                      <h4>No Courses Found</h4>
                      <p>Try adjusting your filters or search terms</p>
                      <button className="clear-filters-btn" onClick={handleClearFilters}>
                        Clear All Filters
                      </button>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
        .all-courses-page {
          padding-top: 80px;
          min-height: 100vh;
          background: #f8f9fa;
        }

        /* Hero Section */
        .courses-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 0;
          position: relative;
          overflow: hidden;
        }

        .courses-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="60" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .hero-content {
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #fff, #f093fb);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 2rem;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Main Content */
        .courses-content {
          padding: 2rem 0;
        }

        /* Sidebar */
        .filters-sidebar {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 100px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f8f9fa;
        }

        .filter-header h4 {
          margin: 0;
          color: #2c3e50;
          font-weight: 600;
        }

        .clear-filters-btn {
          background: none;
          border: 1px solid #dee2e6;
          color: #6c757d;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-filters-btn:hover {
          background: #f8f9fa;
          border-color: #adb5bd;
        }

        .filter-section {
          margin-bottom: 2rem;
        }

        .filter-section h6 {
          color: #495057;
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Search Input */
        .search-input-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          z-index: 2;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* Skills Filter */
        .skills-filter {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .skill-checkbox {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .skill-checkbox:hover {
          background: #f8f9fa;
        }

        .skill-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #667eea;
        }

        .skill-checkbox label {
          flex: 1;
          margin: 0;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .course-count {
          font-size: 0.8rem;
          color: #6c757d;
          background: #f8f9fa;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
        }

        /* Price Filter */
        .price-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .price-inputs input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        .price-inputs span {
          font-size: 0.85rem;
          color: #6c757d;
        }

        /* Sort Select */
        .sort-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          font-size: 0.9rem;
          background: white;
          cursor: pointer;
        }

        .sort-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* Suggest Button */
        .suggest-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .suggest-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        /* Main Content */
        .courses-main {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .results-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .results-header h3 {
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .results-subtitle {
          color: #6c757d;
          margin: 0;
        }

        /* Category Section */
        .category-section {
          margin-bottom: 3rem;
        }

        .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f8f9fa;
        }

        .category-title {
          color: #2c3e50;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .category-title i {
          color: #667eea;
        }

        .course-count-badge {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* Courses Grid */
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        /* Course Card */
        .course-card-wrapper {
          position: relative;
        }

        .course-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .course-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .course-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
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
        }

        .course-card:hover .course-overlay {
          opacity: 1;
        }

        .preview-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          color: #2c3e50;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .preview-btn:hover {
          background: white;
          transform: scale(1.05);
        }

        .enrollment-badge {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Course Content */
        .course-content {
          padding: 1.5rem;
        }

        .course-category {
          margin-bottom: 1rem;
        }

        .category-tag {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .course-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.8rem;
        }

        .course-description {
          color: #6c757d;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.7rem;
        }

        .course-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .stars {
          display: flex;
          gap: 0.2rem;
        }

        .stars i {
          color: #ffc107;
          font-size: 0.9rem;
        }

        .stars .bi-star {
          color: #dee2e6;
        }

        .rating-text {
          font-size: 0.85rem;
          color: #6c757d;
        }

        .course-footer {
          border-top: 1px solid #f8f9fa;
          padding-top: 1rem;
        }

        .price-section {
          margin-bottom: 1rem;
        }

        .current-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #28a745;
        }

        .course-actions {
          display: flex;
          gap: 0.5rem;
        }

        .details-btn {
          flex: 1;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #667eea;
          color: #667eea;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .details-btn:hover {
          background: #667eea;
          color: white;
          transform: translateY(-1px);
        }

        .add-cart-btn {
          flex: 2;
          padding: 0.5rem 1rem;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .add-cart-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .add-cart-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .owned-btn {
          flex: 2;
          padding: 0.5rem 1rem;
          background: linear-gradient(45deg, #28a745, #20c997);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: not-allowed;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6c757d;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          color: #dee2e6;
        }

        .empty-state h4 {
          color: #495057;
          margin-bottom: 1rem;
        }

        .empty-state p {
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            gap: 2rem;
          }

          .filters-sidebar {
            position: static;
            margin-bottom: 2rem;
            max-height: none;
          }

          .courses-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .all-courses-page {
            padding-top: 70px;
          }

          .courses-hero {
            padding: 2rem 0;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .courses-content {
            padding: 1rem 0;
          }

          .courses-main {
            padding: 1rem;
          }

          .category-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }

          .course-actions {
            flex-direction: column;
          }

          .details-btn,
          .add-cart-btn,
          .owned-btn {
            flex: none;
          }
        }

        @media (max-width: 576px) {
          .container-fluid {
            padding: 0 10px;
          }

          .filters-sidebar,
          .courses-main {
            padding: 1rem;
            border-radius: 8px;
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .course-card {
            margin: 0 auto;
            max-width: 100%;
          }

          .price-inputs {
            flex-direction: column;
            gap: 0.75rem;
          }

          .price-inputs span {
            align-self: center;
          }
        }

        /* Loading Animation */
        .course-card.loading {
          opacity: 0.6;
          pointer-events: none;
        }

        /* Smooth Scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Focus States for Accessibility */
        .course-card:focus-within {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        button:focus,
        input:focus,
        select:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        /* Print Styles */
        @media print {
          .filters-sidebar {
            display: none;
          }
          
          .courses-hero {
            background: #667eea !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
      </div>
  );
};