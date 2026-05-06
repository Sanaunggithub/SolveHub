import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes, FaComment } from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function CommentSection({ discussionId }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [discussionId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/comments/discussions/${discussionId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      alert("You must be logged in to comment.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post(
        `/comments/discussions/${discussionId}`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const response = await api.put(
        `/comments/${commentId}`,
        { content: editContent },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComments(comments.map((c) => (c.id === commentId ? response.data : c)));
      setEditingId(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment.");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-4">Loading comments...</div>;
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaComment /> Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 resize-none"
            rows="3"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
          Please log in to post a comment.
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => {
            const isAuthor = isAuthenticated && user && user.id === comment.user_id;
            const isEditing = editingId === comment.id;

            return (
              <div
                key={comment.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-800">
                      {comment.author?.full_name || "Anonymous"}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(comment.created_at).toLocaleDateString()} at{" "}
                      {new Date(comment.created_at).toLocaleTimeString()}
                    </span>
                    {comment.updated_at && comment.updated_at !== comment.created_at && (
                      <span className="text-gray-400 text-xs ml-2 italic">
                        (edited)  
                      </span>
                    )}
                  </div>
                  {/* show edit and delete buttons only when user is the author and the comment is not currently being updated */}
                  {isAuthor && !isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(comment)}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-300 resize-none"
                      rows="3"
                    />
                    <div className="flex gap-2 justify-end mt-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition flex items-center gap-1"
                      >
                        <FaTimes size={12} /> Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center gap-1"
                      >
                        <FaSave size={12} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}