import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/axiosConfig";

function ChapterLessonsPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = async () => {
    try {
      const res = await apiClient.get(`/admin/chapter/${chapterId}/lessons`);
      const sorted = [...res.data].sort((a, b) => a.lessonOrder - b.lessonOrder);
      setLessons(sorted);
    } catch (err) {
      console.error("❌ Error loading lessons:", err);
      alert("Failed to load lessons.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewVideo = async (filename) => {
    try {
      const res = await apiClient.post("/file/signed-url/view", {
        objectName: filename,
        folder: "mainvideo",
      });
      const signedUrl = res.data.signedUrl;
      if (!signedUrl) return alert("No signed URL received.");
      window.open(signedUrl, "_blank");
    } catch (err) {
      console.error("❌ Error getting signed URL:", err);
      alert("Unable to open video.");
    }
  };

  const moveLesson = async (index, direction) => {
    const newList = [...lessons];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newList.length) return;

    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    const reordered = newList.map((lesson, idx) => ({
      ...lesson,
      lessonOrder: idx + 1,
    }));

    setLessons(reordered);

    try {
      await apiClient.put(`/admin/chapter/${chapterId}/lessons/reorder`, reordered);
    } catch (err) {
      console.error("❌ Error reordering lessons:", err);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [chapterId]);

  return (
    <div className="p-6 max-w-5xl mx-auto mt-10 bg-white shadow-xl rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📚 Lesson List</h1>
        <button
          onClick={() => navigate(`/dashboard/admin/chapters/${chapterId}/lessons/new`)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl"
        >
          + Create New Lesson
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading lessons...</p>
      ) : lessons.length === 0 ? (
        <p className="text-gray-600 italic">No lessons available.</p>
      ) : (
        <table className="w-full table-auto border mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Content</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson, index) => (
              <tr key={lesson.lessonId} className="border-t">
                <td className="px-4 py-2">{lesson.lessonOrder}</td>
                <td className="px-4 py-2 font-medium">{lesson.title}</td>
                <td className="px-4 py-2 text-sm text-gray-600 line-clamp-2 max-w-xs">
                  {lesson.content}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      lesson.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {lesson.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => moveLesson(index, -1)}
                    disabled={index === 0}
                    className="text-xs bg-gray-300 px-2 py-1 rounded disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveLesson(index, 1)}
                    disabled={index === lessons.length - 1}
                    className="text-xs bg-gray-300 px-2 py-1 rounded disabled:opacity-50"
                  >
                    ↓
                  </button>

                  {lesson.mainVideoUrl ? (
                    <button
                      onClick={() => handleViewVideo(lesson.mainVideoUrl)}
                      className="text-xs bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Video
                    </button>
                  ) : (
                    <span className="text-xs italic text-gray-500">No video</span>
                  )}

                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/admin/chapters/${chapterId}/lessons/${lesson.lessonId}/edit`
                      )
                    }
                    className="text-xs bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/dashboard/admin/lessons/${lesson.lessonId}/resources`)
                    }
                    className="text-xs bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    Resources
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ChapterLessonsPage;
