import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { publicApiClient } from "../lib/publicApiClient";
import { apiClient } from "../lib/axiosConfig"; // dùng riêng cho signed URL
import FeatureCourseCard from "./FeatureCourseCard";

export default function FeatureCourseList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const topicId = searchParams.get("topic_id") || "0";
  const sortField = searchParams.get("field") || "";
  const sortOrder = searchParams.get("order") || "asc";
  const page = parseInt(searchParams.get("page") || "0", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);
  const search = searchParams.get("search") || "";

  const [topics, setTopics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(search);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const getSignedImageUrl = async (objectName) => {
    try {
      const res = await apiClient.post("/file/public/signed-url/view", {
        objectName,
        type: "img",
        folder: "img",
      });
      return res.data.signedUrl;
    } catch (err) {
      console.error("Failed to get signed URL:", err);
      return null;
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await publicApiClient.get("/public/user/topics");
      setTopics(res.data || []);
    } catch (err) {
      console.error("Failed to load topics", err);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size,
        status: "ACTIVE",
        ...(search && { search }),
        ...(sortField && sortOrder && { sort: `${sortField},${sortOrder}` }),
      };

      const res = await publicApiClient.get(
        `public/user/courses/topics/${topicId}/courses`,
        { params }
      );

      const content = res.data.content || [];
      setTotalPages(res.data.totalPages || 0);
      setTotalItems(res.data.totalElements || 0);

      const signedCourses = await Promise.all(
        content.map(async (course) => {
          const signedUrl = course.imageUrl
            ? await getSignedImageUrl(course.imageUrl)
            : null;
          return { ...course, signedImageUrl: signedUrl };
        })
      );

      setCourses(signedCourses);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      params.set(key, value);
    });
    setSearchParams(params);
  };

  const handleTopicChange = (e) => {
    updateSearchParams({ topic_id: e.target.value, page: 0 });
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [topicId, sortField, sortOrder, page, size, search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Filter Bar */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search courses..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            updateSearchParams({ search: e.target.value, page: 0 });
          }}
          className="px-4 py-2 rounded-xl border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-2 shadow-sm w-full sm:w-64"
        />

        <select
          value={sortField}
          onChange={(e) =>
            updateSearchParams({ field: e.target.value, page: 0 })
          }
          className="px-4 py-2 rounded-xl border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-2 shadow-sm w-40"
        >
          <option value="">📊 Sort by</option>
          <option value="price">💰 Price</option>
          <option value="title">🔠 Name</option>
          <option value="rating">⭐ Rating</option>
          <option value="popular">🔥 Popular</option>
          <option value="updateAt">🆕 Newest</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) =>
            updateSearchParams({ order: e.target.value, page: 0 })
          }
          className="px-4 py-2 rounded-xl border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-2 shadow-sm w-40"
        >
          <option value="">↕️ Order</option>
          <option value="asc">⬆️ Ascending</option>
          <option value="desc">⬇️ Descending</option>
        </select>

        <select
          value={topicId}
          onChange={handleTopicChange}
          className="px-4 py-2 rounded-xl border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-2 shadow-sm w-full sm:w-56"
        >
          <option value="0">📚 All Topics</option>
          {topics.map((topic) => (
            <option key={topic.topicid} value={topic.topicid}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>

      {/* Total */}
      <p className="text-center text-gray-500 mb-4">
        🎓 Found <strong>{totalItems}</strong> courses
      </p>

      {/* Course List */}
      {loading ? (
        <p className="text-center text-blue-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses found.</p>
      ) : (
        <>
          <div className="flex flex-wrap -mx-4">
            {courses.map((course) => (
              <FeatureCourseCard key={course.courseId} course={course} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4 border-t pt-4">
            <div className="flex gap-2">
              <button
                onClick={() => updateSearchParams({ page: page - 1 })}
                disabled={page <= 0}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 border disabled:opacity-50 transition"
              >
                ⬅ Previous
              </button>
              <span className="px-3 py-2 text-gray-600 font-medium">
                Page {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => updateSearchParams({ page: page + 1 })}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 border disabled:opacity-50 transition"
              >
                Next ➡
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="pageSize" className="text-gray-600">
                Items per page:
              </label>
              <select
                id="pageSize"
                value={size}
                onChange={(e) =>
                  updateSearchParams({ size: e.target.value, page: 0 })
                }
                className="px-3 py-1.5 rounded border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-300 focus:ring-2"
              >
                <option value="6">6</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
