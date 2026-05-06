import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function DiscussionForm({ onCreated, onUpdated, editingDiscussion, onCancel }) {
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = !!editingDiscussion;

  // whenever user edit the form, it fils the form
  useEffect(() => {
    if (editingDiscussion) {
      setTitle(editingDiscussion.title || "");
      setContent(editingDiscussion.content || "");
      setCategory(editingDiscussion.category?.[0] || "");
      setTags(editingDiscussion.tags?.join(", ") || "");
    }
  }, [editingDiscussion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("You must be logged in to post a discussion.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const payload = {
        title,
        content,
        category: category ? [category] : [],
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      if (isEditMode) {
        // Update existing discussion
        const response = await api.put(
          `/discussions/${editingDiscussion.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (onUpdated) onUpdated(response.data);
      } else {
        // Create new discussion
        const response = await api.post("/discussions/", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (onCreated) onCreated(response.data);
      }

      // Reset form
      setTitle("");
      setContent("");
      setCategory("");
      setTags("");
    } catch (err) {
      console.error("Error saving discussion:", err);
      setError(`Failed to ${isEditMode ? "update" : "create"} discussion. Try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setTags("");
    setError("");
    if (onCancel) onCancel();
  };

  const categories = [
    "General",
    "Technology",
    "Education",
    "Health",
    "Business",
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        {isEditMode ? "Edit Discussion" : "Create New Discussion"}
      </h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Title */}
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
        />

        {/* Content */}
        <textarea
          placeholder="Write your discussion content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="border p-2 rounded h-32 resize-none focus:ring-2 focus:ring-blue-300"
        ></textarea>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Tags */}
        <input
          type="text"
          placeholder="Enter tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
        />

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : isEditMode ? "Update" : "Post Discussion"}
          </button>
        </div>
      </form>
    </div>
  );
}