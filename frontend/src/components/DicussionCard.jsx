import { FaEdit, FaTrash, FaSave, FaTimes, FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function DiscussionCard({ discussion, onDeleted, onUpdated }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(discussion.title);
  const [content, setContent] = useState(discussion.content);
  const [category, setCategory] = useState(discussion.category?.[0] || "");
  const [tags, setTags] = useState(discussion.tags?.join(", ") || "");
  const [loading, setLoading] = useState(false);
  const [upvotes, setUpvotes] = useState(discussion.upvotes || 0);
  const [downvotes, setDownvotes] = useState(discussion.downvotes || 0);
  const [voting, setVoting] = useState(false);
  const [userVote, setUserVote] = useState(null);

  const isAuthor = isAuthenticated && user && user.id === discussion.user_id;
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchVoteStatus();
    }
  }, [discussion.id, isAuthenticated]);

  const fetchVoteStatus = async () => {
    try {
      const response = await api.get(
        `/discussions/${discussion.id}/vote-status`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.voted) {
        setUserVote(response.data.vote_type);
      }
    } catch (err) {
      console.error("Error fetching vote status:", err);
    }
  };
  
  const handleVote = async (e, voteType) => {
    e.stopPropagation(); // ensures only the vote action happens
    
    if (!isAuthenticated) {
      return alert("You must be logged in to vote.");
    }
    
    try {
      setVoting(true);
      const response = await api.post(
        `/discussions/${discussion.id}/vote/${voteType}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUpvotes(response.data.upvotes);
      setDownvotes(response.data.downvotes);
      setUserVote(response.data.user_vote);
    } catch (err) {
      console.error("Error voting:", err);
      alert("Failed to register vote.");
    } finally {
      setVoting(false);
    }
  };
  
  const handleDelete = async (e) => {
    e.stopPropagation();// stop the click from triggering other click handlers
    if (!isAuthenticated) return alert("You must be logged in to delete.");
    if (!window.confirm("Are you sure you want to delete this discussion?")) return;

    try {
      await api.delete(`/discussions/${discussion.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Discussion deleted successfully.");
      if (onDeleted) onDeleted(discussion.id); // call callback function
    } catch (err) {
      console.error(err);
      alert("Failed to delete discussion.");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  
  // cancel editing mode and restet form fields
  const handleCancel = () => {
    setIsEditing(false);
    setTitle(discussion.title);
    setContent(discussion.content);
    setCategory(discussion.category?.[0] || "");
    setTags(discussion.tags?.join(", ") || "");
  };

  // save after editing
  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/discussions/${discussion.id}`,
        {
          title,
          content,
          category: category ? [category] : [],
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean) // filter(Boolean) removes falsy value
          ,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (onUpdated) onUpdated(response.data);
      setIsEditing(false);
      alert("Discussion updated successfully!");
    } catch (err) {
      console.error("Error updating discussion:", err);
      alert("Failed to update discussion.");
    } finally {
      setLoading(false);
    }
  };
  // open discussion detail when the discussion card is clicked
  const handleCardClick = () => {
    if (!isEditing) {
      navigate(`/discussions/${discussion.id}`);
    }
  };

  const categories = [
    "General",
    "Technology",
    "Education",
    "Health",
    "Business",
  ];

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-300">
        <h3 className="text-lg font-bold text-gray-700 mb-3">Edit Discussion</h3>
        
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
          />

          <textarea
            placeholder="Write your discussion content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 rounded h-32 resize-none focus:ring-2 focus:ring-blue-300"
          ></textarea>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
          />

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition"
            >
              <FaSave /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition relative cursor-pointer"
      onClick={handleCardClick}
    >
      <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
        {discussion.title}
      </h2>
      <p className="text-gray-600 mt-2 line-clamp-3">{discussion.content}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {discussion.tags?.map((tag, i) => (
          <span
            key={i}
            className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-600"
          >
            #{tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <span>{discussion.views || 0} views</span>
          <span className="flex items-center gap-1">
            <FaComment size={14} />
            {discussion.comment_count || 0}
          </span>
        </div>
        
        {/* Voting Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => handleVote(e, "upvote")}
            disabled={voting}
            className={`flex items-center gap-1 px-3 py-1 rounded transition ${
              userVote === "upvote"
                ? "bg-green-500 text-white font-bold"
                : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600"
            } disabled:opacity-50`}
          >
            <FaThumbsUp size={16} /> 
            <span className="font-semibold">{upvotes}</span>
          </button>
          
          <button
            onClick={(e) => handleVote(e, "downvote")}
            disabled={voting}
            className={`flex items-center gap-1 px-3 py-1 rounded transition ${
              userVote === "downvote"
                ? "bg-red-500 text-white font-bold"
                : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
            } disabled:opacity-50`}
          >
            <FaThumbsDown size={16} />
            <span className="font-semibold">{downvotes}</span>
          </button>
        </div>
      </div>
      
      {/* if user is author, show edit button and delete button */}
      {isAuthor && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button 
            onClick={handleEdit} 
            className="text-blue-500 hover:text-blue-700 p-2"
          >
            <FaEdit />
          </button>
          <button 
            onClick={handleDelete} 
            className="text-red-500 hover:text-red-700 p-2"
          >
            <FaTrash />
          </button>
        </div>
      )}
    </div>
  );
}