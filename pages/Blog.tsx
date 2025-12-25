import React, { useEffect, useState } from 'react';
import { getBlogPosts } from '../services/blogService.ts';
import { BlogPost } from '../types.ts';
import { Loader2, Info, AlertCircle, RefreshCcw, Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from '../services/dataService.ts';

const Blog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBlogPosts(true); // Only fetched published posts
      setPosts(data);
    } catch (err: any) {
      console.error("Failed to load blog posts", err);
      setError(err.message || "Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-12">
        <div className="text-center mb-16">
            <h1 className="font-serif text-4xl text-deep-green mb-4">Wellness Journal</h1>
            <p className="text-gray-600">Thoughts on mindfulness, movement, and living well.</p>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-sage-green" size={48} />
            </div>
        ) : error ? (
            <div className="max-w-2xl mx-auto text-center py-12 bg-red-50 rounded-2xl border border-red-200 px-6">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-medium text-red-800 mb-2">Connection Error</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <button 
                    onClick={fetchPosts}
                    className="inline-flex items-center gap-2 bg-white border border-red-300 text-red-700 px-6 py-2 rounded-full hover:bg-red-50 transition-colors font-medium"
                >
                    <RefreshCcw size={16} /> Try Again
                </button>
            </div>
        ) : posts.length === 0 ? (
             <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <Info size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900">No stories yet</h3>
                <p className="text-gray-500 mt-2">Check back soon for our latest articles.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map(post => (
                    <article 
                        key={post.id} 
                        className="group cursor-pointer flex flex-col h-full"
                        onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                        <div className="rounded-2xl overflow-hidden mb-4 h-60 bg-gray-100">
                            <img 
                                src={post.image || 'https://picsum.photos/seed/yoga/800/400'} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                            <span className="text-sage-green font-medium uppercase tracking-wider">{post.category}</span>
                            <span>•</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h2 className="font-serif text-xl font-bold text-gray-900 mb-2 group-hover:text-sage-green transition-colors leading-tight">
                            {post.title}
                        </h2>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                        
                        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                            <div className="text-sage-green font-medium text-sm group-hover:underline">Read more →</div>
                            <div className="flex items-center gap-4 text-gray-400 text-xs">
                                <span className="flex items-center gap-1">
                                    <Heart size={14} className={post.likes > 0 ? "fill-red-400 text-red-400" : ""} /> {post.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageCircle size={14} /> {post.comment_count || 0}
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        )}
    </div>
  );
};
export default Blog;