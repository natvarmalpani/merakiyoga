import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from '../services/dataService';
import { getBlogPostBySlug, getComments, addComment, incrementBlogLikes, deleteComment } from '../services/blogService';
import { BlogPost as BlogPostType, BlogComment } from '../types';
import { supabase } from '../services/supabaseClient';
import { Loader2, Calendar, User, Heart, Share2, MessageCircle, Send, ArrowLeft, Trash2, ShieldCheck, Facebook, Twitter, Linkedin, Link as LinkIcon, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Interaction State
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  
  // Share Menu State
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // Comment Form State
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        if (!slug) return;
        setLoading(true);
        try {
            // Check auth status for Admin features
            const { data: { session } } = await supabase.auth.getSession();
            setIsAdmin(!!session);

            // Fetch Post
            const postData = await getBlogPostBySlug(slug);
            if (!postData) {
                setError("Post not found");
                return;
            }
            setPost(postData);
            setLikesCount(postData.likes);
            
            // Check local storage for like status
            const hasLiked = localStorage.getItem(`meraki_blog_like_${postData.id}`);
            if (hasLiked) setLiked(true);

            // Fetch Comments
            const commentsData = await getComments(postData.id);
            setComments(commentsData);

        } catch (err: any) {
            console.error(err);
            setError("Failed to load content.");
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [slug]);

  // Click outside to close share menu
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
              setShowShareMenu(false);
              setCopySuccess(false);
          }
      };
      if (showShareMenu) {
          document.addEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

  const handleLike = async () => {
    if (liked || !post) return;
    
    // Optimistic UI update
    setLiked(true);
    setLikesCount(prev => prev + 1);
    localStorage.setItem(`meraki_blog_like_${post.id}`, 'true');

    try {
        await incrementBlogLikes(post.id);
    } catch (err) {
        console.error("Failed to sync like", err);
    }
  };

  const handleNativeShare = async () => {
    if (!post) return;
    const url = window.location.href;
    const title = post.title;
    const text = post.excerpt;

    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
        } catch (err: any) {
            // If aborted, do nothing. If error, fallback to menu.
            if (err.name !== 'AbortError') {
                setShowShareMenu(true);
            }
        }
    } else {
        setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = async () => {
      try {
          await navigator.clipboard.writeText(window.location.href);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
          console.error("Failed to copy", err);
      }
  };

  const openSocialShare = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin') => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(post?.title || '');
      
      let shareUrl = '';
      
      switch(platform) {
          case 'whatsapp':
              shareUrl = `https://wa.me/?text=${text}%20${url}`;
              break;
          case 'facebook':
              shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
              break;
          case 'twitter':
              shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
              break;
          case 'linkedin':
              shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
              break;
      }
      
      if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
          setShowShareMenu(false);
      }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    if (!isAdmin && (!commentForm.name || !commentForm.email)) return;
    
    setSubmittingComment(true);
    try {
        const newComment = await addComment({
            post_id: post.id,
            content: commentForm.content,
            user_name: isAdmin ? 'Meraki Team' : commentForm.name,
            user_email: isAdmin ? 'admin@meraki.com' : commentForm.email,
            is_admin: isAdmin
        });
        setComments([...comments, newComment]);
        setCommentForm({ name: '', email: '', content: '' });
    } catch (err) {
        alert("Failed to post comment. Please try again.");
    } finally {
        setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (id: number) => {
      if (!window.confirm("Delete this comment?")) return;
      try {
          await deleteComment(id);
          setComments(comments.filter(c => c.id !== id));
      } catch (err) {
          alert("Failed to delete comment");
      }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-sage-green" size={48} /></div>;
  }

  if (error || !post) {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-2xl font-serif text-gray-800 mb-4">{error || "Post not found"}</h2>
            <button onClick={() => navigate('/blog')} className="text-sage-green hover:underline">Back to Journal</button>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/blog')} className="flex items-center text-gray-500 hover:text-sage-green mb-8 transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Journal
        </button>

        <article>
            <div className="mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                    <span className="bg-sage-green/10 text-deep-green px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                        {post.category}
                    </span>
                    <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl text-deep-green leading-tight mb-6">{post.title}</h1>
                <p className="text-xl text-gray-600 leading-relaxed font-light">{post.excerpt}</p>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm mb-10 h-[400px] bg-gray-100">
                <img src={post.image || 'https://picsum.photos/seed/yoga/1200/600'} alt={post.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-lg prose-headings:font-serif prose-headings:text-deep-green prose-p:text-gray-600 prose-a:text-sage-green max-w-none whitespace-pre-wrap">
                {post.content}
            </div>
            
            <div className="border-t border-b border-gray-100 py-6 mt-12 flex items-center justify-between">
                <div className="flex items-center gap-6 relative">
                    <button 
                        onClick={handleLike}
                        disabled={liked}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${liked ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500'}`}
                    >
                        <Heart size={20} fill={liked ? "currentColor" : "none"} />
                        <span className="font-medium">{likesCount} Likes</span>
                    </button>
                    
                    {/* Share Button & Popup Menu */}
                    <div className="relative" ref={shareMenuRef}>
                        <button 
                            onClick={handleNativeShare}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${showShareMenu ? 'bg-sage-green text-white' : 'bg-gray-50 text-gray-600 hover:bg-sage-green/10 hover:text-deep-green'}`}
                        >
                            <Share2 size={20} />
                            <span className="font-medium">Share</span>
                        </button>

                        <AnimatePresence>
                            {showShareMenu && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute left-0 bottom-full mb-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-10"
                                >
                                    <div className="grid grid-cols-1 gap-1">
                                        <button 
                                            onClick={() => openSocialShare('whatsapp')} 
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors text-left"
                                        >
                                            <MessageCircle size={18} /> WhatsApp
                                        </button>
                                        <button 
                                            onClick={() => openSocialShare('facebook')} 
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors text-left"
                                        >
                                            <Facebook size={18} /> Facebook
                                        </button>
                                        <button 
                                            onClick={() => openSocialShare('twitter')} 
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-500 rounded-lg transition-colors text-left"
                                        >
                                            <Twitter size={18} /> Twitter
                                        </button>
                                        <button 
                                            onClick={() => openSocialShare('linkedin')} 
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 rounded-lg transition-colors text-left"
                                        >
                                            <Linkedin size={18} /> LinkedIn
                                        </button>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button 
                                            onClick={copyToClipboard} 
                                            className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                        >
                                            <span className="flex items-center gap-3">
                                                <LinkIcon size={18} /> {copySuccess ? 'Copied!' : 'Copy Link'}
                                            </span>
                                            {copySuccess && <Check size={16} className="text-green-600" />}
                                        </button>
                                    </div>
                                    <div className="absolute left-6 top-full w-3 h-3 bg-white transform rotate-45 border-r border-b border-gray-100 -mt-1.5 shadow-sm"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </article>

        {/* Comments Section */}
        <section className="mt-16 bg-gray-50 rounded-3xl p-8 md:p-12">
            <h3 className="font-serif text-2xl text-deep-green mb-8 flex items-center gap-2">
                <MessageCircle className="text-sage-green" /> Discussion ({comments.length})
            </h3>

            {/* List Comments */}
            <div className="space-y-6 mb-12">
                {comments.length === 0 ? (
                    <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts.</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative ${comment.is_admin ? 'border-sage-green/30 bg-sage-green/5' : ''}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${comment.is_admin ? 'bg-deep-green text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {comment.is_admin ? <ShieldCheck size={14} /> : comment.user_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <span className={`font-semibold text-sm ${comment.is_admin ? 'text-deep-green' : 'text-gray-900'}`}>
                                            {comment.user_name}
                                        </span>
                                        {comment.is_admin && <span className="ml-2 text-[10px] bg-deep-green text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Admin</span>}
                                        <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <button onClick={() => handleDeleteComment(comment.id)} className="text-gray-400 hover:text-red-500 p-1">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-700 text-sm pl-10">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">Leave a Comment</h4>
                
                {!isAdmin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</label>
                            <input 
                                type="text" 
                                required
                                value={commentForm.name}
                                onChange={e => setCommentForm({...commentForm, name: e.target.value})}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage-green outline-none"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email <span className="text-gray-400 font-normal lowercase">(Not published)</span></label>
                            <input 
                                type="email" 
                                required
                                value={commentForm.email}
                                onChange={e => setCommentForm({...commentForm, email: e.target.value})}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage-green outline-none"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                )}
                
                {isAdmin && (
                    <div className="mb-4 bg-sage-green/10 text-deep-green px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        <ShieldCheck size={16} /> Posting publicly as <strong>Meraki Team</strong>
                    </div>
                )}

                <div className="space-y-1 mb-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Comment</label>
                    <textarea 
                        rows={3}
                        required
                        value={commentForm.content}
                        onChange={e => setCommentForm({...commentForm, content: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage-green outline-none resize-none"
                        placeholder="Share your thoughts..."
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={submittingComment}
                        className="bg-deep-green text-white px-6 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition-all flex items-center gap-2"
                    >
                        {submittingComment ? <Loader2 className="animate-spin" size={18} /> : <>Post Comment <Send size={16} /></>}
                    </button>
                </div>
            </form>
        </section>
    </div>
  );
};

export default BlogPost;
