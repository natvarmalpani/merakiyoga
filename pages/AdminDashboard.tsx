import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from '../services/dataService.ts';
import { supabase } from '../services/supabaseClient.ts';
import { getStyles, createStyle, deleteStyle, updateStyle } from '../services/styleService.ts';
import { getSchedule, createSession, updateSession, deleteSession } from '../services/scheduleService.ts';
import { getInquiries, deleteInquiry } from '../services/contactService.ts';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '../services/programService.ts';
import { getPricingPlans, createPricingPlan, updatePricingPlan, deletePricingPlan } from '../services/pricingService.ts';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../services/blogService.ts';
import { getFeedback, createFeedback, updateFeedback, deleteFeedback } from '../services/feedbackService.ts';
import { YogaStyle, ClassSession, ContactInquiry, Course, PricingPlan, BlogPost, CustomerFeedback } from '../types.ts';
import { 
  Calendar, 
  BookOpen, 
  CreditCard, 
  PenTool, 
  LogOut, 
  Menu, 
  X,
  Leaf,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Database,
  Terminal,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
  Upload,
  Star,
  Quote
} from 'lucide-react';
// @ts-ignore
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
const motion = framerMotion as any;

// Helper Components
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-deep-green">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20} /></button>
        </div>
        <div className="p-5 sm:p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const DashboardSection = ({ title, description, onAdd, children, hideAddButton }: any) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="px-1">
        <h2 className="font-serif text-2xl sm:text-3xl text-deep-green">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
      {!hideAddButton && (
          <button onClick={onAdd} className="bg-sage-green text-white px-4 py-2.5 rounded-lg font-medium hover:bg-deep-green transition-colors flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center">
            <Plus size={18} /> Add New
          </button>
      )}
    </div>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {children}
    </div>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="p-12 text-center">
    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
      <Database size={32} />
    </div>
    <p className="text-gray-500 font-medium">{message}</p>
  </div>
);

const TableWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-200">
        <div className="inline-block min-w-full align-middle">
            {children}
        </div>
    </div>
);

const Badge = ({ children, type }: { children?: React.ReactNode, type?: string }) => {
  let colorClass = "bg-gray-100 text-gray-600";
  if (type === 'Beginner' || type === 'Beginners') colorClass = "bg-green-50 text-green-700 border border-green-100";
  else if (type === 'Intermediate') colorClass = "bg-yellow-50 text-yellow-700 border border-yellow-100";
  else if (type === 'Advanced') colorClass = "bg-orange-50 text-orange-700 border border-orange-100";
  else if (type === 'true' || type === 'published') colorClass = "bg-blue-50 text-blue-700 border border-blue-100";
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>{children}</span>;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('styles');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data State
  const [styles, setStyles] = useState<YogaStyle[]>([]);
  const [scheduleData, setScheduleData] = useState<ClassSession[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [programs, setPrograms] = useState<Course[]>([]);
  const [pricingPlansData, setPricingPlansData] = useState<PricingPlan[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);

  // Pagination
  const [messagePage, setMessagePage] = useState(1);
  const messagesPerPage = 10;
  
  // Modals
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin'); return; }
      try { await fetchAllData(); } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    init();
  }, [navigate]);

  const fetchAllData = async () => {
    const [fetchedStyles, fetchedSchedule, fetchedInquiries, fetchedPrograms, fetchedPricing, fetchedPosts, fetchedFeedback] = await Promise.all([
      getStyles(), getSchedule(), getInquiries(), getPrograms(), getPricingPlans(), getBlogPosts(false), getFeedback()
    ]);
    setStyles(fetchedStyles);
    setScheduleData(fetchedSchedule);
    setInquiries(fetchedInquiries);
    setPrograms(fetchedPrograms);
    setPricingPlansData(fetchedPricing);
    setBlogPosts(fetchedPosts);
    setFeedback(fetchedFeedback);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/admin'); };

  const handleFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'image') {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedPdf(file);
    }
  };

  const openModal = (type: string, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({ ...item, benefits: Array.isArray(item.benefits) ? item.benefits.join(', ') : item.benefits });
      if (item.image) setImagePreview(item.image);
    } else {
      setFormData({});
      setImagePreview(null);
    }
    setSelectedImage(null);
    setSelectedPdf(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (payload.benefits && typeof payload.benefits === 'string') {
        payload.benefits = payload.benefits.split(',').map((b: string) => b.trim()).filter(Boolean);
      }

      if (modalType === 'styles') {
        if (editingItem) await updateStyle(editingItem.slug, payload, selectedImage);
        else await createStyle(payload, selectedImage);
      } else if (modalType === 'schedule') {
        if (editingItem) await updateSession(editingItem.id, payload);
        else await createSession(payload);
      } else if (modalType === 'programs') {
        if (editingItem) await updateProgram(editingItem.slug, payload, selectedImage, selectedPdf);
        else await createProgram(payload, selectedImage, selectedPdf);
      } else if (modalType === 'pricing') {
        if (editingItem) await updatePricingPlan(editingItem.id, payload);
        else await createPricingPlan(payload);
      } else if (modalType === 'feedback') {
        if (editingItem) await updateFeedback(editingItem.id, payload, selectedImage);
        else await createFeedback(payload, selectedImage);
      } else if (modalType === 'blog') {
        if (editingItem) await updateBlogPost(editingItem.id, payload, selectedImage);
        else await createBlogPost(payload, selectedImage);
      }
      
      await fetchAllData();
      setModalType(null);
    } catch (err: any) {
      alert(err.message || 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (type: string, item: any) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      if (type === 'styles') await deleteStyle(item.slug, item.image);
      else if (type === 'schedule') await deleteSession(item.id);
      else if (type === 'programs') await deleteProgram(item.slug);
      else if (type === 'pricing') await deletePricingPlan(item.id);
      else if (type === 'feedback') await deleteFeedback(item.id);
      else if (type === 'blog') await deleteBlogPost(item.id);
      else if (type === 'inquiry') await deleteInquiry(item.id);
      await fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const renderTable = (type: string, data: any[]) => {
    if (data.length === 0) return <EmptyState message={`No ${type} entries.`} />;
    
    return (
      <TableWrapper>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            <tr>
              <th className="px-6 py-4">Name/Title</th>
              {type === 'styles' && <th className="px-6 py-4">Difficulty</th>}
              {type === 'schedule' && <th className="px-6 py-4">Time</th>}
              {type === 'programs' && <th className="px-6 py-4">Price</th>}
              {type === 'pricing' && <th className="px-6 py-4">Period</th>}
              {type === 'feedback' && <th className="px-6 py-4">Rating</th>}
              {type === 'blog' && <th className="px-6 py-4">Status</th>}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center gap-3">
                      {(item.image || item.image === "") && (
                        <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden shrink-0">
                          {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <ImageIcon size={14} className="m-auto mt-2 text-gray-300"/>}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{item.name || item.title || item.classType}</div>
                        {item.instructor && <div className="text-[10px] text-gray-400">{item.instructor}</div>}
                      </div>
                   </div>
                </td>
                {type === 'styles' && <td className="px-6 py-4"><Badge type={item.difficulty}>{item.difficulty}</Badge></td>}
                {type === 'schedule' && <td className="px-6 py-4 text-xs">{item.day} {item.time}</td>}
                {type === 'programs' && <td className="px-6 py-4 font-bold text-deep-green">₹{item.price}</td>}
                {type === 'pricing' && <td className="px-6 py-4 text-gray-500 text-xs">{item.period}</td>}
                {type === 'feedback' && <td className="px-6 py-4 text-yellow-500"><Star size={14} fill="currentColor" className="inline mr-1"/>{item.rating}</td>}
                {type === 'blog' && <td className="px-6 py-4"><Badge type={item.published ? 'published' : 'draft'}>{item.published ? 'Published' : 'Draft'}</Badge></td>}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(type, item)} className="p-1.5 text-gray-400 hover:text-sage-green"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(type, item)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'styles': return <DashboardSection title="Yoga Styles" description="Manage studio class types." onAdd={() => openModal('styles')}>{renderTable('styles', styles)}</DashboardSection>;
      case 'schedule': return <DashboardSection title="Schedule" description="Manage class timetable." onAdd={() => openModal('schedule')}>{renderTable('schedule', scheduleData)}</DashboardSection>;
      case 'programs': return <DashboardSection title="Programs" description="Manage curated courses." onAdd={() => openModal('programs')}>{renderTable('programs', programs)}</DashboardSection>;
      case 'pricing': return <DashboardSection title="Pricing" description="Manage membership tiers." onAdd={() => openModal('pricing')}>{renderTable('pricing', pricingPlansData)}</DashboardSection>;
      case 'feedback': return <DashboardSection title="Feedback" description="Manage student testimonials." onAdd={() => openModal('feedback')}>{renderTable('feedback', feedback)}</DashboardSection>;
      case 'blog': return <DashboardSection title="Blog" description="Manage wellness articles." onAdd={() => openModal('blog')}>{renderTable('blog', blogPosts)}</DashboardSection>;
      case 'messages': 
        const currentMsgs = inquiries.slice((messagePage-1)*messagesPerPage, messagePage*messagesPerPage);
        return <DashboardSection title="Inquiries" description="Client messages." hideAddButton>{renderTable('inquiry', currentMsgs)}</DashboardSection>;
      default: return <EmptyState message="Section missing." />;
    }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin text-sage-green" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-deep-green text-white fixed h-full z-[60]">
        <div className="p-8 border-b border-white/5"><Link to="/" className="font-serif text-2xl font-bold">Meraki</Link></div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {[
            { id: 'styles', label: 'Styles', icon: <Leaf size={20} /> },
            { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} /> },
            { id: 'programs', label: 'Programs', icon: <BookOpen size={20} /> },
            { id: 'pricing', label: 'Pricing', icon: <CreditCard size={20} /> },
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
            { id: 'feedback', label: 'Feedback', icon: <Quote size={20} /> },
            { id: 'blog', label: 'Blog', icon: <PenTool size={20} /> },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === item.id ? 'bg-sage-green text-deep-green font-bold' : 'text-gray-400 hover:text-white'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-300"><LogOut size={18} /> Sign Out</button></div>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-24 lg:pt-8 min-h-screen">
        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </main>

      <Modal isOpen={!!modalType} onClose={() => setModalType(null)} title={`${editingItem ? 'Edit' : 'Add'} ${modalType}`}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {/* Dynamic Form Fields */}
             {modalType === 'styles' && (
                <>
                  <div className="sm:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Name</label><input name="name" value={formData.name || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" required /></div>
                  <div className="sm:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Description</label><textarea name="description" value={formData.description || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" rows={3} required /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Difficulty</label><select name="difficulty" value={formData.difficulty || 'Beginner'} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Duration</label><input name="duration" value={formData.duration || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" /></div>
                  <div className="sm:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Benefits (comma separated)</label><input name="benefits" value={formData.benefits || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" /></div>
                </>
             )}

             {modalType === 'schedule' && (
                <>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Day</label><select name="day" value={formData.day || 'Monday'} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none"><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option></select></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Time</label><input name="time" value={formData.time || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" placeholder="07:00 AM" required /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Class Type</label><input name="classType" value={formData.classType || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" required /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Instructor</label><input name="instructor" value={formData.instructor || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" required /></div>
                </>
             )}

             {modalType === 'programs' && (
                <>
                  <div className="sm:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Title</label><input name="title" value={formData.title || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" required /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Price (₹)</label><input type="number" name="price" value={formData.price || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" required /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Duration</label><input name="duration" value={formData.duration || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" /></div>
                  <div className="sm:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Description</label><textarea name="description" value={formData.description || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" rows={2} required /></div>
                  <div className="sm:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Brochure PDF</label><input type="file" accept="application/pdf" onChange={e => handleFileChange(e, 'pdf')} className="w-full text-xs" /></div>
                </>
             )}

             {modalType === 'pricing' && (
                <>
                  <div className="sm:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Plan Name</label><input name="name" value={formData.name || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" required /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Price</label><input name="price" value={formData.price || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" required /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Period</label><input name="period" value={formData.period || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" placeholder="per month" /></div>
                  <div className="sm:col-span-2 flex items-center gap-2"><input type="checkbox" name="highlight" checked={formData.highlight || false} onChange={handleFormChange} id="highlight"/><label htmlFor="highlight" className="text-sm">Highlight as Best Value</label></div>
                </>
             )}

             {modalType === 'feedback' && (
                <>
                  <div className="sm:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Student Name</label><input name="name" value={formData.name || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" required /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Rating (1-5)</label><input type="number" name="rating" value={formData.rating || 5} min="1" max="5" onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" required /></div>
                  <div className="sm:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Quote</label><textarea name="quote" value={formData.quote || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" rows={3} required /></div>
                </>
             )}

             {modalType === 'blog' && (
                <>
                  <div className="sm:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Post Title</label><input name="title" value={formData.title || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" required /></div>
                  <div className="sm:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Excerpt</label><textarea name="excerpt" value={formData.excerpt || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" rows={2} required /></div>
                  <div className="sm:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Content (Markdown supported)</label><textarea name="content" value={formData.content || ''} onChange={handleFormChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none font-mono text-xs" rows={6} required /></div>
                  <div className="flex items-center gap-2"><input type="checkbox" name="published" checked={formData.published || false} onChange={handleFormChange} id="published"/><label htmlFor="published" className="text-sm">Published</label></div>
                </>
             )}

             {/* Shared Image Section */}
             {['styles', 'programs', 'feedback', 'blog'].includes(modalType!) && (
                <div className="sm:col-span-2 border-t pt-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Cover Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                      {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <Upload className="text-gray-300" />}
                    </div>
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'image')} className="text-xs" />
                  </div>
                </div>
             )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setModalType(null)} className="px-6 py-2 text-sm text-gray-500">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-deep-green text-white px-8 py-2 rounded-xl font-medium flex items-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;