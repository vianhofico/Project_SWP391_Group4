// src/pages/dashboard/Resource.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { apiClient } from "@/lib/axiosConfig";

const Resource = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const assignedPage = parseInt(searchParams.get("assignedPage") || "0");
  const unassignedPage = parseInt(searchParams.get("unassignedPage") || "0");
  const size = searchParams.get("size") || "10";
  const title = searchParams.get("title") || "";
  const type = searchParams.get("type") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const direction = searchParams.get("direction") || "desc";

  const [assignedResources, setAssignedResources] = useState([]);
  const [unassignedResources, setUnassignedResources] = useState([]);
  const [viewUrls, setViewUrls] = useState({});
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [selectedToRemove, setSelectedToRemove] = useState([]);
  const [assignedTotalPages, setAssignedTotalPages] = useState(0);
  const [unassignedTotalPages, setUnassignedTotalPages] = useState(0);

  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  };

  const fetchSignedUrl = async (objectName) => {
    try {
      const { data } = await apiClient.post("/file/signed-url/view", {
        objectName,
        type:"document",
        folder: "resources",
      });
      return data.signedUrl;
    } catch {
      return "#";
    }
  };

  const prepareViewUrls = async (resources) => {
    const urls = {};
    for (const res of resources) {
      urls[res.url] = await fetchSignedUrl(res.url);
    }
    return urls;
  };

  const fetchResources = async () => {
    try {
      const commonParams = new URLSearchParams({
        size,
        title,
        type,
        sortBy,
        direction,
      });

      const assignedParams = new URLSearchParams(commonParams);
      assignedParams.set("page", assignedPage);

      const unassignedParams = new URLSearchParams(commonParams);
      unassignedParams.set("page", unassignedPage);

      const [assignedRes, unassignedRes] = await Promise.all([
        apiClient.get(`/admin/resources/in-lesson/${lessonId}?${assignedParams}`),
        apiClient.get(`/admin/resources/not-in-lesson/${lessonId}?${unassignedParams}`),
      ]);

      const all = [...assignedRes.data.content, ...unassignedRes.data.content];
      const urls = await prepareViewUrls(all);

      setAssignedResources(assignedRes.data.content);
      setUnassignedResources(unassignedRes.data.content);
      setAssignedTotalPages(assignedRes.data.totalPages);
      setUnassignedTotalPages(unassignedRes.data.totalPages);
      setViewUrls(urls);
      setSelectedToAdd([]);
      setSelectedToRemove([]);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  useEffect(() => {
    if (lessonId) {
      fetchResources();
    }
  }, [lessonId, searchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateSearchParams({ [name]: value, assignedPage: 0, unassignedPage: 0 });
  };

  const handleCheckbox = (id, listSetter, list) => {
    listSetter((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleAssignSubmit = async () => {
    try {
      if (selectedToAdd.length > 0) {
        await apiClient.put(`/admin/resources/${lessonId}/resources/assign`, selectedToAdd);
        fetchResources();
        alert("✅ Assigned!");
      }
    } catch {
      alert("❌ Failed to assign!");
    }
  };

  const handleRemoveSubmit = async () => {
    try {
      if (selectedToRemove.length > 0) {
        await apiClient.put(`/admin/resources/${lessonId}/resources/remove`, selectedToRemove);
        fetchResources();
        alert("✅ Removed!");
      }
    } catch {
      alert("❌ Failed to remove!");
    }
  };

  const renderTable = (resources, isAssigned) => (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Chọn</th>
            <th className="p-2">Title</th>
            <th className="p-2">Type</th>
            <th className="p-2">URL</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((res) => (
            <tr key={res.resourceId} className="border-t">
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={
                    isAssigned
                      ? selectedToRemove.includes(res.resourceId)
                      : selectedToAdd.includes(res.resourceId)
                  }
                  onChange={() =>
                    handleCheckbox(
                      res.resourceId,
                      isAssigned ? setSelectedToRemove : setSelectedToAdd
                    )
                  }
                />
              </td>
              <td className="p-2">{res.title}</td>
              <td className="p-2">{res.type}</td>
              <td className="p-2">
                <a
                  href={viewUrls[res.url] || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPagination = (currentPage, totalPages, key) => (
    <div className="flex gap-2 mt-4 justify-center">
      <button
        onClick={() => updateSearchParams({ [key]: Math.max(currentPage - 1, 0) })}
        disabled={currentPage === 0}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-3 py-1">{`Page ${currentPage + 1} / ${totalPages}`}</span>
      <button
        onClick={() => updateSearchParams({ [key]: Math.min(currentPage + 1, totalPages - 1) })}
        disabled={currentPage + 1 >= totalPages}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">📚 Resources for lesson #{lessonId}</h2>
        <button
          onClick={() => navigate(`/dashboard/admin/lessons/${lessonId}/resources/create`)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Create Resource
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <input
          type="text"
          name="title"
          value={title}
          placeholder="Search by title"
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        />
        <select
          name="type"
          value={type}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="document">Document</option>
          <option value="video">Video</option>
          <option value="image">Image</option>
        </select>
        <select
          name="sortBy"
          value={sortBy}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        >
          <option value="createdAt">Newest</option>
          <option value="title">Title</option>
          <option value="type">Type</option>
        </select>
        <select
          name="direction"
          value={direction}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="mb-10">
        <h3 className="font-bold mb-2 text-lg">✅ Assigned Resources</h3>
        {assignedResources.length === 0 ? (
          <p className="italic text-gray-500">No assigned resources.</p>
        ) : (
          <>
            {renderTable(assignedResources, true)}
            {selectedToRemove.length > 0 && (
              <div className="mt-4 text-right">
                <button
                  onClick={handleRemoveSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Xóa khỏi bài học
                </button>
              </div>
            )}
            {renderPagination(assignedPage, assignedTotalPages, "assignedPage")}
          </>
        )}
      </div>

      <div>
        <h3 className="font-bold mb-2 text-lg">📂 Unassigned Resources</h3>
        {unassignedResources.length === 0 ? (
          <p className="italic text-gray-500">No unassigned resources.</p>
        ) : (
          <>
            {renderTable(unassignedResources, false)}
            {selectedToAdd.length > 0 && (
              <div className="mt-4 text-right">
                <button
                  onClick={handleAssignSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Thêm vào bài học
                </button>
              </div>
            )}
            {renderPagination(unassignedPage, unassignedTotalPages, "unassignedPage")}
          </>
        )}
      </div>
    </div>
  );
};

export default Resource;
