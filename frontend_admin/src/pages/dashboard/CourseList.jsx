import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiClient } from "@/lib/axiosConfig";

export default function CourseList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const topicId = searchParams.get("topic_id") || "0";
  const sortOrder = searchParams.get("order") || "asc";
  const sortField = searchParams.get("field") || "";
  const page = searchParams.get("page") || "0";
  const size = searchParams.get("size") || "10";
  const status = searchParams.get("status") || "";

  const [topics, setTopics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTopics = async () => {
    try {
      const res = await apiClient.get("/admin/topics");
      setTopics(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch topics:", err);
    }
  };

  const handleStatusChange = (newStatus) => {
    updateSearchParams({ status: newStatus, page: 0 });
  };

  const getSignedImageUrl = async (objectName) => {
    try {
      const res = await apiClient.post("/file/signed-url/view", {
        objectName,
        folder: "img",
      });
      return res.data.signedUrl;
    } catch (err) {
      console.error("❌ Failed to get signed image URL:", err);
      return null;
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { page, size };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (sortField) params.sort = sortField;
      if (sortOrder) params.order = sortOrder;
      if (status) params.status = status;

      const res = await apiClient.get(
        `/admin/courses/topics/${topicId}/courses`,
        { params }
      );

      const content = res.data.content || [];
      const coursesWithSignedUrl = await Promise.all(
        content.map(async (course) => {
          if (course.imageUrl) {
            const signedUrl = await getSignedImageUrl(course.imageUrl);
            return { ...course, signedImageUrl: signedUrl };
          }
          return course;
        })
      );

      setCourses(coursesWithSignedUrl);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error("❌ Error fetching courses:", err);
      setError("Failed to load courses.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (str) => {
    if (!str) return "N/A";
    const d = new Date(str);
    return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleAdd = () => navigate("/dashboard/courses/new");
  const handleEdit = (id) => navigate(`edit/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await apiClient.delete(`/admin/courses/${id}`);
      fetchCourses();
    } catch (err) {
      alert("Failed to delete course.");
      console.error("❌ Failed to delete:", err);
    }
  };

  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  };

  const handleTopicChange = (e) => {
    const selectedTopicId = e.target.value;
    updateSearchParams({ topic_id: selectedTopicId, page: 0 });
  };

  const handlePreviousChange = () => {
    const prevPage = Math.max(0, Number(page) - 1);
    updateSearchParams({ page: prevPage });
  };

  const handleNextPage = () => {
    const nextPage = Number(page) + 1;
    updateSearchParams({ page: nextPage });
  };

  const handlePageSizeChange = (e) => {
    const pageSize = e.target.value;
    updateSearchParams({ size: pageSize, page: 0 });
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [topicId, searchQuery, sortField, sortOrder, page, size, status]);

  const selectedTopic = topics.find((t) => t?.topicId?.toString() === topicId);

  return (
    <div className="mt-12 px-4 max-w-6xl mx-auto">
      <div className="p-6 bg-white shadow rounded-xl mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {topicId !== "0"
              ? `Courses in Topic "${selectedTopic?.name || topicId}"`
              : "All Courses"}
          </h2>
          <button
            onClick={handleAdd}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Course
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateSearchParams({ page: 0 });
            }}
            className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-48"
          />
          <select
            value={sortField}
            onChange={(e) => updateSearchParams({ field: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md w-40"
          >
            <option value="">Sort by</option>
            <option value="price">Price</option>
            <option value="title">Name</option>
            <option value="rating">Rating</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => updateSearchParams({ order: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md w-40"
          >
            <option value="">Order</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <select
            value={topicId}
            onChange={handleTopicChange}
            className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-52"
          >
            <option value="0">All Topics</option>
            {topics.map((topic) => (
              <option key={topic.topicid} value={topic.topicid}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          {[
            { label: "All", value: "" },
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => handleStatusChange(btn.value)}
              className={`px-3 py-2 rounded border ${
                status === btn.value ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-6 text-blue-500 font-medium">Loading...</div>
      )}
      {error && (
        <div className="text-center py-6 text-red-500 font-medium">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {["ID", "Image", "Title", "Price", "Status", "Rating", "Updated At", "Actions"].map(
                    (col) => (
                      <th key={col} className="px-4 py-3 border-b">
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-500">
                      No courses available.
                    </td>
                  </tr>
                ) : (
                  courses.map((course, index) => (
                    <tr key={course.courseId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 border-b">{course.courseId}</td>
                      <td className="px-4 py-3 border-b">
                        {course.signedImageUrl ? (
                          <img
                            src={course.signedImageUrl}
                            alt="thumbnail"
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-4 py-3 border-b">{course.title}</td>
                      <td className="px-4 py-3 border-b">{course.price ?? "N/A"}</td>
                      <td className="px-4 py-3 border-b">{course.status ?? "N/A"}</td>
                      <td className="px-4 py-3 border-b">
                        {course.rating != null ? course.rating.toFixed(1) : "N/A"}
                      </td>
                      <td className="px-4 py-3 border-b">{formatDate(course.updateAt)}</td>
                      <td className="px-4 py-3 border-b space-x-2">
                        <button
                          onClick={() => handleEdit(course.courseId)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.courseId)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 px-2">
            <p className="text-sm text-gray-600">
              Showing page {Number(page) + 1} of {totalPages} | Total: {totalElements} courses
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={Number(page) === 0}
                onClick={handlePreviousChange}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-2">Page {Number(page) + 1}</span>
              <button
                disabled={Number(page) + 1 >= totalPages}
                onClick={handleNextPage}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
              <select
                value={size}
                onChange={handlePageSizeChange}
                className="ml-4 px-2 py-1 border rounded"
              >
                {[5, 10, 20, 50].map((s) => (
                  <option key={s} value={s}>
                    {s}/page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
