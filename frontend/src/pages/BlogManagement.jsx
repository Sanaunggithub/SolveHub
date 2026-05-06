import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function BlogManagement() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    is_published: false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // wait until auth finishes loading
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchUserBlogs();
    }
  }, [user]);

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/user/${user.id}`, {
        params: { skip: 0, limit: 100, published_only: false }
      });
      setBlogs(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load your blogs');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      tags: '',
      is_published: false
    });
    setEditingBlog(null);
  };

  const openModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        content: blog.content,
        category: Array.isArray(blog.category) ? blog.category[0] || '' : (blog.category || ''),
        tags: blog.tags?.join(', ') || '',
        is_published: blog.is_published
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true); // shows modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        category: formData.category ? [formData.category] : [],
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      let response;
      if (editingBlog) {
        // Update blog
        response = await api.put(`/blogs/${editingBlog.id}`, payload);
        setSuccess('Blog updated successfully!');
      } else {
        // Create blog
        response = await api.post('/blogs', payload);
        setSuccess('Blog created successfully!');
      }
      // edit or create blog
      setBlogs(editingBlog 
        ? blogs.map(b => b.id === response.data.id ? response.data : b)
        : [...blogs, response.data]
      );
      
      closeModal();
    } catch (err) {
      console.error('Error saving blog:', err);
      setError(err.response?.data?.detail || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await api.delete(`/blogs/${blogId}`);
      setBlogs(blogs.filter(b => b.id !== blogId)); // update UI to remove blog
      setSuccess('Blog deleted successfully!');
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError(err.response?.data?.detail || 'Failed to delete blog');
    }
  };

  const handleTogglePublish = async (blog) => {
    try {
      const endpoint = blog.is_published ? 'unpublish' : 'publish';
      const response = await api.post(`/blogs/${blog.id}/${endpoint}`);
      setBlogs(blogs.map(b => b.id === blog.id ? response.data : b)); // update UI
      setSuccess(`Blog ${endpoint}ed successfully!`);
    } catch (err) {
      console.error('Error toggling publish:', err);
      setError(err.response?.data?.detail || 'Failed to update blog');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Blogs</h1>
              <p className="text-gray-600 mt-2">Create and manage your blog posts</p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Blog
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Blogs List */}
          {blogs.length > 0 ? (
            <div className="space-y-4">
              {blogs.map(blog => (
                <div key={blog.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900">{blog.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          blog.is_published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {blog.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{blog.content?.substring(0, 150)}...</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {blog.category && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {Array.isArray(blog.category) ? blog.category[0] : blog.category}
                          </span>
                        )}
                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleTogglePublish(blog)}
                        title={blog.is_published ? 'Unpublish' : 'Publish'}
                        className={`p-2 rounded-lg transition-colors ${
                          blog.is_published
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {blog.is_published ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                      
                      <button
                        onClick={() => openModal(blog)}
                        title="Edit"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        title="Delete"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => navigate(`/blog/${blog.id}`)}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No blogs yet</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Your First Blog
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingBlog ? 'Edit Blog' : 'Create New Blog'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter blog title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows="8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Write your blog content..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_published"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="is_published" className="ml-2 text-sm text-gray-700">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving...' : editingBlog ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
