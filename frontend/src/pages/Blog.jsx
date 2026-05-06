import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Edit2, Trash2, Eye } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import profile from '../assets/profile.svg';

export default function Blog() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const LIMIT = 6; // Number of blogs per page

  useEffect(() => {
    fetchBlogs();
  }, []);

  
  const fetchBlogs = async (newSkip = 0) => {
    try {
      if (newSkip === 0) {
        setLoading(true); // first load
      } else {
        setLoadingMore(true); // load more blogs
      }
      // fetch blogs from backend
      const response = await api.get('/blogs', {
        params: {
          skip: newSkip,
          limit: LIMIT,
          published_only: true
        }
      });

      const fetchedBlogs = response.data || [];
      
      if (newSkip === 0) {
        setBlogs(fetchedBlogs); // replace blogs
      } else {
        setBlogs(prev => [...prev, ...fetchedBlogs]) // append more blogs
      }

      // Check if there are more blogs to load
      setHasMore(fetchedBlogs.length === LIMIT);
      setSkip(newSkip + LIMIT);
      setError(null);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // when user click more
  const handleReadMore = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handleLoadMore = () => {
    fetchBlogs(skip);
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/blogs/${blogId}`); // send delete request to backend
      setBlogs(blogs.filter(b => b.id !== blogId)); // removed the blog from UI
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog');
    }
  };

  const handleEditBlog = (blogId) => {
    navigate('/my-blogs');
  };

  // Fallback to dummy data if no blogs loaded
  const displayBlogs = blogs.length > 0 ? blogs : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Latest Blog Posts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover insights, tutorials, and industry trends from our community of developers and tech enthusiasts.
          </p>
          {user && (
            <button
              onClick={() => navigate('/my-blogs')}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Manage My Blogs
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Blog Cards Grid */}
        {displayBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  {/* Blog Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category */}
                    {blog.category && blog.category.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.category.map((cat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h2>

                    {/* Meta Info */}
                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {blog.content ? `${Math.ceil(blog.content.split(' ').length / 200)} min` : "N/A"}
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {blog.content.substring(0, 150)}...
                    </p>

                    {/* Read More Button */}
                    <button 
                      onClick={() => handleReadMore(blog.id)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 mb-4 self-start"
                    >
                      Read More
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Author Profile */}
                    <div className="flex items-center pt-4 border-t border-gray-200 mt-auto">
                      <div className="flex-shrink-0">
                        <img
                          src={profile}
                          alt={blog.author?.full_name || "Author"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {blog.author?.full_name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Author
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Section */}
            {hasMore && (
              <div className="text-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? "Loading..." : "Load More Posts"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blogs available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}