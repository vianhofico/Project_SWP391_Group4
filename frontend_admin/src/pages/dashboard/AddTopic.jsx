import { useState } from "react";
import { apiClient } from "@/lib/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function AddTopic({ onTopicAdded }) {
  const [topic, setTopic] = useState({ name: "", description: "", status: "isactive" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdTopicId, setCreatedTopicId] = useState(null);

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setTopic((prev) => ({ ...prev, [field]: value }));
  };

  const toggleStatus = () => {
    setTopic((prev) => ({
      ...prev,
      status: prev.status === "active" ? "isactive" : "active",
    }));
  };

  const handleAdd = async () => {
    if (!topic.name.trim()) {
      alert("Topic name is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/admin/topics", topic);
      const createdTopic = response.data;
      console.log("Created topic:", createdTopic);
      alert("Topic added successfully ✅");
      setTopic({ name: "", description: "", status: "isactive" });
      setCreatedTopicId(createdTopic.topicId);
      if (onTopicAdded) onTopicAdded(createdTopic);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Failed to add topic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToCourseList = () => {
    if (createdTopicId) {
      navigate(`/dashboard/topics/${createdTopicId}/courses`);
    }
  };

  const handleGoToTopicList = () => {
    navigate("/dashboard/topics");
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Topic</h2>

      {success ? (
        <div className="flex justify-between space-x-4">
          <button
            onClick={handleGoToTopicList}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back to Topics
          </button>
          <button
            onClick={handleGoToCourseList}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Courses to This Topic
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Topic Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={topic.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter topic name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <input
              type="text"
              value={topic.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter topic description"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Status</label>
            <button
              type="button"
              onClick={toggleStatus}
              disabled={loading}
              className={`px-4 py-2 rounded-md font-medium ${
                topic.status === "active"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
            >
              {topic.status === "ACTIVE" ? "ACTIVE (Click to INACTIVE)" : "INACTIVE (Click to ACTIVE)"}
            </button>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Topic"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
