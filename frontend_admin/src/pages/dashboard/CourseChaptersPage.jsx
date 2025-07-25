import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/axiosConfig";

function CourseChaptersPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);
  const [newTitles, setNewTitles] = useState([""]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/admin/course/${courseId}/chapters`, {
        params: { page, size },
      });
      setChapters(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Fetch chapters failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async () => {
    const validTitles = newTitles.filter((title) => title.trim() !== "");
    if (validTitles.length === 0) return;

    try {
      await apiClient.post(`/admin/course/${courseId}/chapters`, validTitles);
      setNewTitles([""]);
      fetchChapters();
    } catch (err) {
      console.error("Add chapters failed:", err);
    }
  };

  const handleEditTitle = async (chapterId) => {
    try {
      await apiClient.put(
        `/admin/course/${courseId}/chapters/${chapterId}/update-title`,
        editTitle,
        {
          headers: { "Content-Type": "text/plain" },
        }
      );
      setEditId(null);
      setEditTitle("");
      fetchChapters();
    } catch (err) {
      console.error("Edit title failed:", err);
    }
  };

  const handleDelete = async (chapterId) => {
    if (!confirm("Delete this chapter?")) return;

    try {
      await apiClient.delete(`/admin/course/${courseId}/chapters/${chapterId}`);
      fetchChapters();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleStatusChange = async (chapterId, status) => {
    try {
      await apiClient.put(
        `/admin/course/${courseId}/chapters/${chapterId}/update-status`,
        status,
        {
          headers: { "Content-Type": "text/plain" },
        }
      );
      fetchChapters();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const moveChapter = async (index, direction) => {
    const newOrder = [...chapters];
    const target = index + direction;
    if (target < 0 || target >= newOrder.length) return;

    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    const reordered = newOrder.map((chapter, idx) => ({
      ...chapter,
      chapterOrder: idx + 1,
    }));

    setChapters(reordered);

    try {
      await apiClient.put(`/admin/course/${courseId}/chapters/reorder`, reordered);
    } catch (err) {
      console.error("Reorder failed:", err);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [courseId, page]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Chapters</h1>
        <button onClick={() => navigate(-1)} className="bg-gray-300 px-3 py-1 rounded">
          Back
        </button>
      </div>

      {/* Add chapters section */}
      <div className="mb-6">
        {newTitles.map((title, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="border px-3 py-2 rounded w-full"
              placeholder={`Chapter ${i + 1} title`}
              value={title}
              onChange={(e) => {
                const updated = [...newTitles];
                updated[i] = e.target.value;
                setNewTitles(updated);
              }}
            />
            <button
              onClick={() =>
                setNewTitles((prev) => prev.filter((_, idx) => idx !== i))
              }
              className="bg-red-400 text-white px-3 rounded"
            >
              ✕
            </button>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setNewTitles([...newTitles, ""])}
            className="text-sm text-blue-500 underline"
          >
            + Add Field
          </button>
          <button
            onClick={handleAddChapter}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add All
          </button>
        </div>
      </div>

      {/* Chapter list */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {chapters.map((chapter, index) => (
            <li
              key={chapter.chapterId}
              className="border p-3 mb-2 rounded flex justify-between items-center"
            >
              <div className="flex-1">
                {editId === chapter.chapterId ? (
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  <div>
                    <strong>{chapter.chapterOrder}. </strong>
                    {chapter.title}
                  </div>
                )}
                <div className="mt-1 text-sm">
                  <span>Status:</span>
                  <select
                    className="ml-2 border px-2 py-1 rounded"
                    value={chapter.status}
                    onChange={(e) =>
                      handleStatusChange(chapter.chapterId, e.target.value)
                    }
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                {editId === chapter.chapterId ? (
                  <>
                    <button
                      onClick={() => handleEditTitle(chapter.chapterId)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditTitle("");
                      }}
                      className="bg-gray-300 px-2 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => moveChapter(index, -1)}
                      disabled={index === 0}
                      className="bg-gray-300 px-2 py-1 rounded text-sm disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveChapter(index, 1)}
                      disabled={index === chapters.length - 1}
                      className="bg-gray-300 px-2 py-1 rounded text-sm disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => {
                        setEditId(chapter.chapterId);
                        setEditTitle(chapter.title);
                      }}
                      className="bg-blue-400 text-white px-2 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/dashboard/admin/chapters/${chapter.chapterId}/lessons`)
                      }
                      className="bg-yellow-400 px-2 py-1 rounded text-sm"
                    >
                      Lessons
                    </button>
                    <button
                      onClick={() => handleDelete(chapter.chapterId)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          className="bg-gray-300 px-4 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page + 1} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          className="bg-gray-300 px-4 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CourseChaptersPage;
