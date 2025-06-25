import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/axiosConfig";

function EditCourseForm() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    status: "",
    imageUrl: "",
    videoTrialUrl: "",
  });

  const [viewUrls, setViewUrls] = useState({ image: "", video: "" });
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedVideos, setDeletedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getSignedViewUrl = async (objectName, folder) => {
    try {
      const res = await apiClient.post("/file/signed-url/view", { objectName, folder });
      return res.data.signedUrl;
    } catch (err) {
      console.error(`Error getting signed URL for ${folder}:`, err);
      return null;
    }
  };

  const fetchDeletedAttachments = async () => {
    const fetchByType = async (type) => {
      const res = await apiClient.get(`/admin/courses/${courseId}/attachments`, {
        params: { type },
      });
      const attachments = res.data || [];
      return await Promise.all(
        attachments.map(async (att) => ({
          ...att,
          signedUrl: await getSignedViewUrl(att.url, type === "image" ? "img" : "videotrial"),
        }))
      );
    };

    try {
      const [images, videos] = await Promise.all([fetchByType("image"), fetchByType("video")]);
      setDeletedImages(images);
      setDeletedVideos(videos);
    } catch (err) {
      console.error("Failed to fetch deleted attachments:", err);
    }
  };

  const fetchCourse = async () => {
    try {
      const { data } = await apiClient.get(`/admin/courses/${courseId}`);
      setFormData({
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        status: data.status || "",
        imageUrl: data.imageUrl || "",
        videoTrialUrl: data.videoTrialUrl || "",
      });

      const [image, video] = await Promise.all([
        data.imageUrl ? getSignedViewUrl(data.imageUrl, "img") : "",
        data.videoTrialUrl ? getSignedViewUrl(data.videoTrialUrl, "videotrial") : "",
      ]);

      setViewUrls({ image, video });
      await fetchDeletedAttachments();
    } catch (err) {
      console.error(err);
      setError("Failed to load course data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e, field, folder) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectName = `${Date.now()}-${file.name}`;
    try {
      const res = await apiClient.post("/file/signed-url/upload", {
        objectName,
        type: file.type,
        folder,
      });

      await fetch(res.data.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      setFormData((prev) => ({ ...prev, [field]: objectName }));
      const newViewUrl = await getSignedViewUrl(objectName, folder);
      setViewUrls((prev) => ({ ...prev, [field === "imageUrl" ? "image" : "video"]: newViewUrl }));
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await apiClient.put(`/admin/courses/${courseId}`, formData);
      alert("Course updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const restoreDeletedAttachment = async (attachmentId) => {
    try {
      const res = await apiClient.patch(`/admin/courses/${courseId}/recover-attachment`, {
        attachmentId,
      });

      const updatedCourse = res.data;
      setFormData((prev) => ({
        ...prev,
        imageUrl: updatedCourse.imageUrl,
        videoTrialUrl: updatedCourse.videoTrialUrl,
      }));

      const [image, video] = await Promise.all([
        updatedCourse.imageUrl ? getSignedViewUrl(updatedCourse.imageUrl, "img") : "",
        updatedCourse.videoTrialUrl ? getSignedViewUrl(updatedCourse.videoTrialUrl, "videotrial") : "",
      ]);

      setViewUrls({ image, video });
      await fetchDeletedAttachments();
      alert("Attachment restored successfully!");
    } catch (err) {
      console.error("Restore failed:", err);
      alert("Failed to restore attachment.");
    }
  };

  if (loading) return <p>Loading course...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Course</h1>
        <button
          onClick={() => navigate(`/dashboard/admin/courses/${courseId}/chapters`)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          🧩 Manage Chapters
        </button>
      </div>

      {/* Form Fields */}
      {[{ label: "Title", name: "title" }, { label: "Description", name: "description", type: "textarea" }, { label: "Price (VND)", name: "price", type: "number" }].map(
        ({ label, name, type }) => (
          <div className="mb-4" key={name}>
            <label className="block font-medium mb-1">{label}</label>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            ) : (
              <input
                type={type || "text"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            )}
          </div>
        )
      )}

      {/* Status Select */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Course Image</label>
        {viewUrls.image && <img src={viewUrls.image} alt="course" className="mb-2 max-h-40" />}
        <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "imageUrl", "img")} />
      </div>

      {/* Video Upload */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Trial Video</label>
        {viewUrls.video && <video src={viewUrls.video} controls className="mb-2 w-full max-h-60" />}
        <input type="file" accept="video/*" onChange={(e) => handleUpload(e, "videoTrialUrl", "videotrial")} />
      </div>

      {/* Deleted Attachments */}
      {[{ label: "🗑 Deleted Images", list: deletedImages, type: "image" }, { label: "🗑 Deleted Videos", list: deletedVideos, type: "video" }].map(
        ({ label, list, type }) => (
          <div className="mb-6" key={type}>
            <h2 className="font-semibold text-lg mb-2">{label}</h2>
            {list.length === 0 ? (
              <p className="text-gray-500">No deleted {type}s</p>
            ) : (
              <div className={type === "image" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
                {list.map((item) => (
                  <div key={item.attachmentId} className="border p-2 rounded">
                    {type === "image" ? (
                      <img src={item.signedUrl} alt="deleted" className="max-h-40 mb-2" />
                    ) : (
                      <video src={item.signedUrl} controls className="w-full max-h-60 mb-2" />
                    )}
                    <p className="text-sm text-gray-600">
                      Deleted at: {new Date(item.deletedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}

      {/* Save Button */}
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

export default EditCourseForm;
