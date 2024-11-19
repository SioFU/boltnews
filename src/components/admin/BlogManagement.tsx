import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { blogService } from '../../lib/supabase';
import type { BlogPost } from '../../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const allPosts = await blogService.getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await blogService.deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => {/* TODO: Implement new post */}}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>New Post</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-6 py-3 text-sm font-semibold text-gray-400">Title</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-400">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-400">Date</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-800">
                <td className="px-6 py-4">
                  <h3 className="font-medium text-white">{post.title}</h3>
                  <p className="text-sm text-gray-400">{post.excerpt}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.status === 'published' ? 'bg-green-500/10 text-green-500' :
                    'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {format(new Date(post.updatedAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {/* TODO: Implement preview */}}
                      className="p-1 text-gray-400 hover:text-white"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {/* TODO: Implement edit */}}
                      className="p-1 text-gray-400 hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}