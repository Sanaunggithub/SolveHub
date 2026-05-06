import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import api from "../api/axios";
import profile from '../assets/profile.svg';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Blog not found");
      setTimeout(() => navigate("/blogs"), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading blog...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blogs
        </button>

        {/* Main Content */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Blog Header */}
          <div className="px-6 py-8 sm:px-12 sm:py-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            {/* Categories/Tags */}
            {blog.category && blog.category.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.category.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(blog.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{blog.author?.full_name || "Unknown Author"}</span>
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="px-6 py-8 sm:px-12 sm:py-12">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Author Section */}
          <div className="px-6 py-8 sm:px-12 sm:py-8 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <img
                src={profile}
                alt={blog.author?.full_name || "Author"}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {blog.author?.full_name || "Unknown Author"}
                </h3>
                <p className="text-gray-600">
                  By {blog.author?.full_name || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts Section*/}
        <div className="mt-12">
          <button
            onClick={() => navigate("/blogs")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            View More Blogs
          </button>
        </div>
      </div>
    </div>
  );
}
