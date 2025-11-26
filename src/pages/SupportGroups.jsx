import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import forumService from '../services/forumService';

const SupportGroups = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New post form
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    isAnonymous: false
  });
  
  // New comment
  const [newComment, setNewComment] = useState('');
  const [isCommentAnonymous, setIsCommentAnonymous] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    try {
      const { categories } = await forumService.getCategories();
      setCategories(categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { posts: fetchedPosts } = await forumService.getPosts({
        category: selectedCategory?._id,
        search: searchQuery,
        sort: sortBy
      });
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (postId) => {
    try {
      const { post } = await forumService.getPost(postId);
      setSelectedPost(post);
    } catch (err) {
      setError('Failed to load post');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await forumService.createPost(newPost);
      setShowNewPostForm(false);
      setNewPost({ title: '', content: '', category: '', isAnonymous: false });
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { comments } = await forumService.addComment(selectedPost._id, {
        content: newComment,
        isAnonymous: isCommentAnonymous
      });
      setSelectedPost({ ...selectedPost, comments });
      setNewComment('');
      setIsCommentAnonymous(false);
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const { liked, likesCount } = await forumService.toggleLike(postId);
      
      // Update in posts list
      setPosts(posts.map(p => 
        p._id === postId ? { ...p, likes: { length: likesCount } } : p
      ));
      
      // Update in selected post if open
      if (selectedPost?._id === postId) {
        setSelectedPost({ ...selectedPost, likes: liked ? [...selectedPost.likes, user.id] : selectedPost.likes.filter(l => l !== user.id) });
      }
    } catch (err) {
      setError('Failed to update like');
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Default categories if backend is empty
  const defaultCategories = [
    { _id: 'anxiety', name: 'Anxiety', icon: '😰', color: '#f59e0b', postCount: 0 },
    { _id: 'depression', name: 'Depression', icon: '🌧️', color: '#6366f1', postCount: 0 },
    { _id: 'stress', name: 'Stress Management', icon: '💆', color: '#10b981', postCount: 0 },
    { _id: 'relationships', name: 'Relationships', icon: '💕', color: '#ec4899', postCount: 0 },
    { _id: 'academic', name: 'Academic Pressure', icon: '📚', color: '#8b5cf6', postCount: 0 },
    { _id: 'general', name: 'General Support', icon: '🤗', color: '#06b6d4', postCount: 0 }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">💬 Support Groups</h1>
        <p className="text-gray-600">Connect with peers, share experiences, and support each other</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
          <button onClick={() => setError('')} className="ml-4 text-red-500 hover:underline">Dismiss</button>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Categories */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-6">
            <h2 className="font-semibold text-gray-800 mb-4">Categories</h2>
            
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition-colors ${
                !selectedCategory ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
              }`}
            >
              🌐 All Posts
            </button>
            
            {displayCategories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors flex items-center justify-between ${
                  selectedCategory?._id === cat._id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                }`}
              >
                <span>
                  <span className="mr-2">{cat.icon}</span>
                  {cat.name}
                </span>
                <span className="text-xs text-gray-500">{cat.postCount}</span>
              </button>
            ))}

            <hr className="my-4" />
            
            <button
              onClick={() => setShowNewPostForm(true)}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              ✏️ New Post
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search & Filters */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Viewed</option>
                <option value="mostLiked">Most Liked</option>
                <option value="active">Most Active</option>
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Search
              </button>
            </form>
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <span className="text-5xl mb-4 block">📝</span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">Be the first to start a conversation!</p>
              <button
                onClick={() => setShowNewPostForm(true)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create Post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => fetchPost(post._id)}
                  className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.isPinned && <span className="text-yellow-500">📌</span>}
                        <span
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ backgroundColor: `${post.category?.color}20`, color: post.category?.color }}
                        >
                          {post.category?.icon} {post.category?.name}
                        </span>
                        {post.isLocked && <span className="text-xs text-gray-500">🔒 Locked</span>}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{post.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>by {post.author?.firstName || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(post.createdAt)}</span>
                        <span>•</span>
                        <span>👁️ {post.views}</span>
                        <span>•</span>
                        <span>❤️ {post.likes?.length || 0}</span>
                        <span>•</span>
                        <span>💬 {post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Create New Post</h2>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a category</option>
                  {displayCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  maxLength={200}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Share your thoughts, experiences, or ask for support..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  maxLength={5000}
                  required
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPost.isAnonymous}
                  onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">Post anonymously</span>
              </label>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: `${selectedPost.category?.color}20`, color: selectedPost.category?.color }}
                    >
                      {selectedPost.category?.icon} {selectedPost.category?.name}
                    </span>
                    {selectedPost.isPinned && <span className="text-yellow-500">📌 Pinned</span>}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedPost.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    by {selectedPost.author?.firstName || 'Anonymous'} • {formatTimeAgo(selectedPost.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap mb-6">{selectedPost.content}</p>

              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <button
                  onClick={() => handleToggleLike(selectedPost._id)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                    selectedPost.likes?.includes(user?.id)
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ❤️ {selectedPost.likes?.length || 0}
                </button>
                <span className="text-gray-500">👁️ {selectedPost.views} views</span>
              </div>

              {/* Comments */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Comments ({selectedPost.comments?.length || 0})
                </h3>

                {selectedPost.comments?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No comments yet. Be the first to respond!</p>
                ) : (
                  <div className="space-y-4 mb-6">
                    {selectedPost.comments?.map((comment, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900">
                            {comment.author?.firstName || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Form */}
                {!selectedPost.isLocked && (
                  <form onSubmit={handleAddComment} className="mt-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a supportive comment..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isCommentAnonymous}
                          onChange={(e) => setIsCommentAnonymous(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                        />
                        <span className="text-sm text-gray-600">Comment anonymously</span>
                      </label>
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>
                )}

                {selectedPost.isLocked && (
                  <p className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg">
                    🔒 This post is locked. Comments are disabled.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportGroups;
