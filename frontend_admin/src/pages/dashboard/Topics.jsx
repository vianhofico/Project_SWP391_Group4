import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import { apiClient } from "@/lib/axiosConfig";

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [tab, setTab] = useState("active");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchTopics = async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        size: pageSize,
      };
      if (searchQuery.trim() !== "") params.search = searchQuery.trim();
      if (sortField !== "") params.sort = sortField;
      if (sortOrder !== "") params.order = sortOrder;

      const res = await apiClient.get(`/admin/topics/${tab}`, { params });

      setTopics(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching topics:", err);
      setError("Failed to load topics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [searchQuery, sortField, sortOrder, tab, refreshToggle, currentPage]);

  const removeTopic = async (topicId) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;

    try {
      await apiClient.delete(`/admin/topics/${topicId}`);
      setRefreshToggle(!refreshToggle);
      alert("🗑️ Successfully deleted!");
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "❌ Error deleting topic!";
      alert(message);
    }
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setCurrentPage(0); // Reset về trang đầu khi đổi tab
  };

  return (
    <div className="mt-12 px-4">
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Topic List</h2>

        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md font-medium border ${
              tab === "active" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleTabChange("active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium border ${
              tab === "inactive" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleTabChange("inactive")}
          >
            Inactive
          </button>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-full md:w-48 focus:outline-none focus:ring focus:ring-blue-300"
          />

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-36 focus:outline-none"
          >
            <option value="">Sort by</option>
            <option value="count">Course Count</option>
            <option value="name">Name</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-36 focus:outline-none"
          >
            <option value="">Order</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <Link
            to={`/dashboard/topics/add`}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200 shadow-md"
          >
            <PlusIcon className="w-5 h-5" />
            Add New
          </Link>
        </div>
      </div>

      {loading && (
        <div className="text-center py-6 text-blue-500 font-medium">Loading data...</div>
      )}
      {error && (
        <div className="text-center py-6 text-red-500 font-medium">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full text-left text-sm border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {["ID", "Name", "Description", "Course Count", "Status", "Actions"].map((head) => (
                    <th key={head} className="px-4 py-3 border-b">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topics.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No topics available.
                    </td>
                  </tr>
                ) : (
                  topics.map((topic, index) => (
                    <tr key={topic.topicid} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 border-b">{topic.topicid}</td>
                      <td className="px-4 py-3 border-b">{topic.name}</td>
                      <td className="px-4 py-3 border-b">{topic.description}</td>
                      <td className="px-4 py-3 border-b">{topic.courseCount}</td>
                      <td className="px-4 py-3 border-b">
                        {topic.status?.toUpperCase() === "ACTIVE" ? (
                          <span className="text-green-600 font-medium">Active</span>
                        ) : (
                          <span className="text-gray-500 italic">Inactive</span>
                        )}
                      </td>
                      <td className="px-4 py-3 border-b">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/topics/${topic.topicid}/courses`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => removeTopic(topic.topicid)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="font-medium text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
