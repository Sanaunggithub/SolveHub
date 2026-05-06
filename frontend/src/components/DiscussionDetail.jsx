import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaThumbsUp, FaThumbsDown, FaEye, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";

export default function DiscussionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTags, setEditTags] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchDiscussion();
    if (isAuthenticated) {
      fetchVoteStatus();
    }
  }, [id, isAuthenticated]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching discussion with ID:', id);
      const token = localStorage.getItem("token");
      console.log('Token present:', !!token);
      
      // Use axios interceptor to automatically include token
      const response = await api.get(`/discussions/${id}`);
      
      console.log('Discussion fetched:', response.data);
      console.log('View count:', response.data.views);
      
      setDiscussion(response.data);
      setEditTitle(response.data.title);
      setEditContent(response.data.content);
      setEditCategory(response.data.category?.[0] || "");
      setEditTags(response.data.tags?.join(", ") || "");
    } catch (error) {
      console.error("Error fetching discussion:", error);
      alert("Discussion not found");
      navigate("/discussions");
    } finally {
      setLoading(false);
    }
  };

  const fetchVoteStatus = async () => {
    try {
      const response = await api.get(`/discussions/${id}/vote-status`);
      if (response.data.voted) {
        setUserVote(response.data.vote_type);
      }
    } catch (err) {
      console.error("Error fetching vote status:", err);
    }
  };

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      return alert("You must be logged in to vote.");
    }

    try {
      setVoting(true);
      const response = await api.post(
        `/discussions/${id}/vote/${voteType}`,
        {}
      );
      setDiscussion((prev) => ({ 
        ...prev, 
        upvotes: response.data.upvotes,
        downvotes: response.data.downvotes 
      }));
      setUserVote(response.data.user_vote);
    } catch (err) {
      console.error("Error voting:", err);
      alert("Failed to register vote.");
    } finally {
      setVoting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(discussion.title);
    setEditContent(discussion.content);
    setEditCategory(discussion.category?.[0] || "");
    setEditTags(discussion.tags?.join(", ") || "");
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const response = await api.put(
        `/discussions/${id}`,
        {
          title: editTitle,
          content: editContent,
          category: editCategory ? [editCategory] : [],
          tags: editTags.split(",").map((t) => t.trim()).filter(Boolean) // filter(Boolean)remove empty tags,
        }
      );
      setDiscussion(response.data);
      setIsEditing(false);
      alert("Discussion updated successfully!");
    } catch (err) {
      console.error("Error updating discussion:", err);
      alert("Failed to update discussion.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this discussion?")) return;
    // quick check for token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete a discussion.");
      return;
    }

    try {
      setDeleteLoading(true);
      const response = await api.delete(`/discussions/${id}`);
      console.log("Delete response:", response);
      alert("Discussion deleted successfully.");
      navigate("/discussions");
    } catch (err) {
      // extract server error data
      const serverData = err.response?.data;
      console.error("Delete error details:", serverData || err);

      // Prefer structured messages if present
      const serverMessage = serverData?.detail || serverData?.message || (serverData && JSON.stringify(serverData));

      if (err.response?.status === 401) {
        alert(serverMessage || "Unauthorized. Please log in and try again.");
      } else if (err.response?.status === 403) {
        alert(serverMessage || "You don't have permission to delete this discussion. Only the author can delete it.");
      } else if (serverMessage) {
        alert(`Failed to delete discussion: ${serverMessage}`);
      } else {
        alert("Failed to delete discussion. See console for details.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const categories = ["General", "Technology", "Education", "Health", "Business"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading discussion...</div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">Discussion not found</div>
      </div>
    );
  }

  const isAuthor = isAuthenticated && user && user.id === discussion.user_id;

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={handleCancelEdit}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft /> Cancel
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Discussion</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-300"
                placeholder="Enter discussion title"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Content</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border p-3 rounded h-64 resize-none focus:ring-2 focus:ring-blue-300"
                placeholder="Write your discussion content..."
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tags</label>
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-300"
                placeholder="Enter tags (comma separated)"
              />
            </div>

            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition"
              >
                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/discussions")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
      >
        <FaArrowLeft /> Back to Discussions
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {discussion.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>By {discussion.author?.full_name || "Unknown"}</span>
              <span>•</span>
              <span>{new Date(discussion.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FaEye /> {discussion.views} views
              </span>
            </div>
          </div>

          {isAuthor && (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="p-2 text-blue-500 hover:text-blue-700 transition"
                title="Edit"
              >
                <FaEdit size={20} />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className={`p-2 text-red-500 hover:text-red-700 transition ${deleteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                title="Delete"
              >
                <FaTrash size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {discussion.category?.map((cat, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold"
            >
              {cat}
            </span>
          ))}
          {discussion.tags?.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="prose max-w-none mb-8">
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
            {discussion.content}
          </p>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 font-semibold">Was this helpful?</div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleVote("upvote")}
                disabled={voting}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg transition ${
                  userVote === "upvote"
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600"
                } disabled:opacity-50`}
              >
                <FaThumbsUp size={20} />
                <span className="font-bold text-lg">{discussion.upvotes || 0}</span>
              </button>

              <button
                onClick={() => handleVote("downvote")}
                disabled={voting}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg transition ${
                  userVote === "downvote"
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                } disabled:opacity-50`}
              >
                <FaThumbsDown size={20} />
                <span className="font-bold text-lg">{discussion.downvotes || 0}</span>
              </button>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="mt-4 text-center text-gray-500 text-sm">
              Please log in to vote on this discussion
            </div>
          )}
        </div>

        {/* Comment Section */}
        <CommentSection discussionId={id} />
      </div>
    </div>
  );
}