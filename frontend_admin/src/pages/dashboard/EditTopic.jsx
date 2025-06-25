import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/axiosConfig";
import UpdateTopic from "./UpdateTopic";

const PAGE_SIZE = 5;

const EditTopic = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [availableCourses, setAvailableCourses] = useState([]);
  const [availablePage, setAvailablePage] = useState(0);
  const [availableTotalPages, setAvailableTotalPages] = useState(0);

  const [topicCourses, setTopicCourses] = useState([]);
  const [topicPage, setTopicPage] = useState(0);
  const [topicTotalPages, setTopicTotalPages] = useState(0);

  const [selectedAvailable, setSelectedAvailable] = useState(new Set());
  const [selectedTopic, setSelectedTopic] = useState(new Set());

  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [status, setStatus] = useState("ACTIVE");

  const getSignedImageUrl = async (objectName) => {
    try {
      const res = await apiClient.post("/file/signed-url/view", {
        objectName,
        folder: "img",
      });
      return res.data.signedUrl;
    } catch (error) {
      console.error("Failed to get signed image URL:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!topicId) return;
    setAvailablePage(0);
    setTopicPage(0);
  }, [search, sortField, sortOrder, status]);

  useEffect(() => {
    fetchCourses();
  }, [topicId, search, sortField, sortOrder, status, availablePage, topicPage]);

  const fetchCourses = async () => {
    try {
      const params = {
        search,
        sort: sortField,
        order: sortOrder,
        status,
        size: PAGE_SIZE,
      };

      const [availableRes, topicRes] = await Promise.all([
        apiClient.get(`/admin/courses/topics/${topicId}/available-courses`, {
          params: { ...params, page: availablePage },
        }),
        apiClient.get(`/admin/courses/topics/${topicId}/courses`, {
          params: { ...params, page: topicPage },
        }),
      ]);

      const availableWithUrls = await Promise.all(
        availableRes.data.content.map(async (course) => {
          const signedImageUrl = course.imageUrl
            ? await getSignedImageUrl(course.imageUrl)
            : null;
          return { ...course, signedImageUrl };
        })
      );

      const topicWithUrls = await Promise.all(
        topicRes.data.content.map(async (course) => {
          const signedImageUrl = course.imageUrl
            ? await getSignedImageUrl(course.imageUrl)
            : null;
          return { ...course, signedImageUrl };
        })
      );

      setAvailableCourses(availableWithUrls);
      setAvailableTotalPages(availableRes.data.totalPages);
      setSelectedAvailable(new Set());

      setTopicCourses(topicWithUrls);
      setTopicTotalPages(topicRes.data.totalPages);
      setSelectedTopic(new Set());
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const toggleSelect = (id, selectedSet, setSelectedSet) => {
    setSelectedSet((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleAdd = async () => {
    if (selectedAvailable.size === 0) {
      alert("Please select at least one course to add.");
      return;
    }
    setLoadingAdd(true);
    try {
      await apiClient.post(`/admin/topics/${topicId}/courses`, {
        courseIds: Array.from(selectedAvailable),
      });
      alert("Courses added successfully!");
      fetchCourses();
    } catch (error) {
      console.error(error);
      alert("Failed to add courses.");
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleDelete = async () => {
    if (selectedTopic.size === 0) {
      alert("Please select at least one course to remove.");
      return;
    }
    setLoadingDelete(true);
    try {
      await apiClient.delete(`/admin/topics/${topicId}/courses`, {
        data: { courseIds: Array.from(selectedTopic) },
      });
      alert("Courses removed successfully!");
      fetchCourses();
    } catch (error) {
      console.error(error);
      alert("Failed to remove courses.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleHardDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course permanently?")) return;
    try {
      await apiClient.delete(`/admin/courses/${courseId}`);
      alert("Course deleted.");
      fetchCourses();
    } catch (error) {
      console.error(error);
      alert("Failed to delete course.");
    }
  };

  const renderPagination = (page, totalPages, setPage) => (
    <div className="flex justify-end items-center space-x-2 mt-2">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span>
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page + 1 >= totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  const renderCourseTable = (courses, selectedSet, toggleFn) => (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full table-auto text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2"></th>
            <th className="p-2">Image</th>
            <th className="p-2">Title</th>
            <th className="p-2">Description</th>
            <th className="p-2">Topic</th>
            <th className="p-2">Price</th>
            <th className="p-2">Rating</th>
            <th className="p-2">Status</th>
            <th className="p-2">Last Updated</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.courseId} className="border-t hover:bg-gray-50">
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedSet.has(course.courseId)}
                  onChange={() => toggleFn(course.courseId)}
                />
              </td>
              <td className="p-2">
                <img
                  src={course.signedImageUrl || "/default-thumbnail.jpg"}
                  alt={course.title}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="p-2 font-medium">{course.title}</td>
              <td className="p-2">{course.description}</td>
              <td className="p-2">{course.topic || "N/A"}</td>
              <td className="p-2 text-green-700">{course.price.toLocaleString()}₫</td>
              <td className="p-2">{course.rating ?? "N/A"}</td>
              <td className="p-2">
                {course.status?.toLowerCase() === "active" ? (
                  <span className="text-green-600">ACTIVE</span>
                ) : (
                  <span className="text-red-600">INACTIVE</span>
                )}
              </td>
              <td className="p-2 text-gray-500">
                {course.updateAt ? new Date(course.updateAt).toLocaleString("en-GB") : "Unknown"}
              </td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => navigate(`/dashboard/courses/edit/${course.courseId}`)}
                  className="px-2 py-1 bg-blue-600 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleHardDelete(course.courseId)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-4 space-y-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Edit Topic</h1>
        <button
          onClick={() => navigate("/dashboard/courses/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          + Create Course
        </button>
      </div>

      <UpdateTopic topicId={topicId} onUpdateSuccess={fetchCourses} />

      <section className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-1"
        />
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="border rounded p-1"
        >
          <option value="title">Title</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="updateAt">Last Updated</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded p-1"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <div className="flex space-x-2">
          <button
            onClick={() => setStatus("ACTIVE")}
            className={`px-3 py-1 rounded border ${
              status === "ACTIVE" ? "bg-green-600 text-white" : "bg-white text-gray-800"
            }`}
          >
            ACTIVE
          </button>
          <button
            onClick={() => setStatus("INACTIVE")}
            className={`px-3 py-1 rounded border ${
              status === "INACTIVE" ? "bg-red-600 text-white" : "bg-white text-gray-800"
            }`}
          >
            INACTIVE
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Add Courses to Topic</h2>
        <button
          onClick={handleAdd}
          disabled={loadingAdd}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded disabled:opacity-50 mb-4"
        >
          {loadingAdd ? "Processing..." : "Add Selected Courses"}
        </button>
        {renderCourseTable(availableCourses, selectedAvailable, (id) =>
          toggleSelect(id, selectedAvailable, setSelectedAvailable)
        )}
        {renderPagination(availablePage, availableTotalPages, setAvailablePage)}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Remove Courses from Topic</h2>
        <button
          onClick={handleDelete}
          disabled={loadingDelete}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded disabled:opacity-50 mb-4"
        >
          {loadingDelete ? "Processing..." : "Remove Selected Courses"}
        </button>
        {renderCourseTable(topicCourses, selectedTopic, (id) =>
          toggleSelect(id, selectedTopic, setSelectedTopic)
        )}
        {renderPagination(topicPage, topicTotalPages, setTopicPage)}
      </section>
    </div>
  );
};

export default EditTopic;
