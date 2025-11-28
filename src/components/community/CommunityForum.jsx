import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import studentService from '../../services/studentService';
import counselorService from '../../services/counselorService';
import adminService from '../../services/adminService';
import {
  Users,
  Plus,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  X,
  Clock,
  Eye,
  Search,
  Shield,
  Award
} from 'lucide-react';

const CommunityForum = ({ showHeader = true, embedded = false }) => {
  const { userProfile } = useAuth();
  const userRole = userProfile?.role || 'student';
  
  // Get the appropriate service based on role
  const getService = () => {
    switch (userRole) {
      case 'admin':
        return {
          getCategories: () => adminService.getCategories(),
          getPosts: (params) => adminService.getPosts(params),
          getPost: (id) => adminService.getPost(id),
          createPost: (data) => adminService.createPost(data),
          addComment: (id, content, isAnon) => adminService.addComment(id, content, isAnon),
          togglePostLike: (id) => adminService.togglePostLike(id),
          deletePost: (id) => adminService.deletePost(id)
        };
      case 'counselor':
        return {
          getCategories: () => counselorService.getCategories(),
          getPosts: (params) => counselorService.getPosts(params),
          getPost: (id) => counselorService.getPost(id),
          createPost: (data) => counselorService.createPost(data),
          addComment: (id, content, isAnon) => counselorService.addComment(id, content, isAnon),
          togglePostLike: (id) => counselorService.togglePostLike(id),
          deletePost: (id) => counselorService.deletePost(id)
        };
      default:
        return {
          getCategories: () => studentService.getCategories(),
          getPosts: (params) => studentService.getPosts(params),
          getPost: (id) => studentService.getPost(id),
          createPost: (data) => studentService.createPost(data),
          addComment: (id, content, isAnon) => studentService.addComment(id, content, isAnon),
          togglePostLike: (id) => studentService.togglePostLike(id),
          deletePost: (id) => studentService.deletePost(id)
        };
    }
  };

  const service = getService();

  // State
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // New Post Modal
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [newPostAnonymous, setNewPostAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Post Detail Modal
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentAnonymous, setCommentAnonymous] = useState(false);

  useEffect(() => {
    loadCategories();
    loadPosts();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, searchTerm]);

  const loadCategories = async () => {
    try {
      const response = await service.getCategories();
      setCategories(response.data?.categories || response.categories || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      
      const response = await service.getPosts(params);
      setPosts(response.data?.posts || response.posts || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Please fill in title and content');
      return;
    }
    try {
      setSubmitting(true);
      await service.createPost({
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory || undefined,
        isAnonymous: newPostAnonymous
      });
      setShowNewPostModal(false);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('');
      setNewPostAnonymous(false);
      loadPosts();
    } catch (err) {
      alert('Failed to create post: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await service.togglePostLike(postId);
      loadPosts();
      if (selectedPost?._id === postId) {
        const response = await service.getPost(postId);
        setSelectedPost(response.data?.post || response.post);
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost) return;
    try {
      await service.addComment(selectedPost._id, newComment, commentAnonymous);
      setNewComment('');
      setCommentAnonymous(false);
      const response = await service.getPost(selectedPost._id);
      setSelectedPost(response.data?.post || response.post);
      loadPosts();
    } catch (err) {
      alert('Failed to add comment: ' + err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await service.deletePost(postId);
        setSelectedPost(null);
        loadPosts();
      } catch (err) {
        alert('Failed to delete post: ' + err.message);
      }
    }
  };

  const handleViewPost = async (post) => {
    try {
      const response = await service.getPost(post._id);
      setSelectedPost(response.data?.post || response.post);
    } catch (err) {
      console.error('Failed to load post:', err);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'counselor':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">
            <Award className="h-3 w-3" />
            Counselor
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 font-medium">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        );
      default:
        return null;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now - then) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className={embedded ? '' : 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50'}>
      <div className={embedded ? '' : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {/* Header */}
        {showHeader && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-500" />
                Community Forum
              </h2>
              <p className="text-gray-600 mt-1">Connect with others and share your experiences</p>
            </div>
            <button
              onClick={() => setShowNewPostModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              New Post
            </button>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
                  !selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
                    selectedCategory === cat._id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">Be the first to share your experience!</p>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium"
              >
                Create First Post
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                onClick={() => handleViewPost(post)}
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                      {post.isAnonymous ? '?' : post.author?.firstName?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {post.isAnonymous ? 'Anonymous' : `${post.author?.firstName || 'User'} ${post.author?.lastName || ''}`}
                        </p>
                        {!post.isAnonymous && post.author?.role && getRoleBadge(post.author.role)}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  {post.category && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {post.category.name}
                    </span>
                  )}
                </div>

                {/* Post Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 line-clamp-3 mb-4">{post.content}</p>

                {/* Post Actions */}
                <div className="flex items-center gap-6 text-gray-500">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLikePost(post._id); }}
                    className="flex items-center gap-2 hover:text-red-500 transition"
                  >
                    <Heart className={`h-5 w-5 ${post.likes?.includes(userProfile?._id) ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{post.likesCount || post.likes?.length || 0}</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>{post.commentsCount || post.comments?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    <span>{post.views || 0}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Create New Post</h3>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="What's on your mind?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Share your thoughts, experiences, or questions..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category (optional)</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  checked={newPostAnonymous}
                  onChange={(e) => setNewPostAnonymous(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Post anonymously</p>
                  <p className="text-sm text-gray-500">Your name won't be shown with this post</p>
                </div>
              </label>
            </div>

            <div className="p-6 border-t flex gap-4">
              <button
                onClick={handleCreatePost}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedPost.isAnonymous ? '?' : selectedPost.author?.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {selectedPost.isAnonymous ? 'Anonymous' : `${selectedPost.author?.firstName || 'User'} ${selectedPost.author?.lastName || ''}`}
                      </p>
                      {!selectedPost.isAnonymous && selectedPost.author?.role && getRoleBadge(selectedPost.author.role)}
                    </div>
                    <p className="text-sm text-gray-500">{formatTimeAgo(selectedPost.createdAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedPost.title}</h2>
              <p className="text-gray-700 whitespace-pre-wrap mb-6">{selectedPost.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-6 pb-6 border-b">
                <button
                  onClick={() => handleLikePost(selectedPost._id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
                >
                  <Heart className={`h-5 w-5 ${selectedPost.likes?.includes(userProfile?._id) ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{selectedPost.likes?.length || 0} likes</span>
                </button>
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="h-5 w-5" />
                  <span>{selectedPost.comments?.length || 0} comments</span>
                </div>
                {(selectedPost.author?._id === userProfile?._id || userRole === 'admin' || userRole === 'counselor') && (
                  <button
                    onClick={() => handleDeletePost(selectedPost._id)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 ml-auto"
                  >
                    <Trash2 className="h-5 w-5" />
                    Delete
                  </button>
                )}
              </div>

              {/* Comments */}
              <div className="py-6">
                <h3 className="font-semibold text-gray-900 mb-4">Comments</h3>
                
                {selectedPost.comments?.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {selectedPost.comments.map((comment, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-green-300 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {comment.isAnonymous ? '?' : comment.author?.firstName?.[0] || 'U'}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {comment.isAnonymous ? 'Anonymous' : `${comment.author?.firstName || 'User'} ${comment.author?.lastName || ''}`}
                            </p>
                            {!comment.isAnonymous && comment.author?.role && getRoleBadge(comment.author.role)}
                            <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4 mb-6">No comments yet. Be the first to comment!</p>
                )}

                {/* Add Comment */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {userProfile?.firstName?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={2}
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={commentAnonymous}
                          onChange={(e) => setCommentAnonymous(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600"
                        />
                        <span className="text-gray-600">Comment anonymously</span>
                      </label>
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
