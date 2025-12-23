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
  Copy,
  Check,
  Terminal,
  MapPin,
  User,
  MessageSquare,
  IndianRupee,
  FileText,
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  Upload
} from 'lucide-react';
// @ts-ignore
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
const motion = framerMotion as any;

const SETUP_SQL = `-- Run this in Supabase SQL Editor to RESET and DISABLE RLS
alter table if exists public.contact_inquiries disable row level security;
alter table if exists public.courses disable row level security;
alter table if exists public.blog_posts disable row level security;
alter table if exists public.blog_comments disable row level security;
alter table if exists public.pricing_plans disable row level security;
alter table if exists public.yoga_styles disable row level security;
alter table if exists public.class_sessions disable row level security;
alter table if exists public.customer_feedback disable row level security;
`;

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

const DashboardSection = ({ title, description, onAdd, children, extraHeaderAction, hideAddButton }: any) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="px-1">
        <h2 className="font-serif text-2xl sm:text-3xl text-deep-green">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {extraHeaderAction}
        {!hideAddButton && (
            <button onClick={onAdd} className="flex-1 sm:flex-none bg-sage-green text-white px-4 py-2.5 rounded-lg font-medium hover:bg-deep-green transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Plus size={18} /> Add New
            </button>
        )}
      </div>
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
  if (type === 'Beginner') colorClass = "bg-green-50 text-green-700 border border-green-100";
  else if (type === 'Intermediate') colorClass = "bg-yellow-50 text-yellow-700 border border-yellow-100";
  else if (type === 'Advanced') colorClass = "bg-orange-50 text-orange-700 border border-orange-100";
  else if (type === 'published' || type === 'true') colorClass = "bg-blue-50 text-blue-700 border border-blue-100";
  else if (type === 'draft' || type === 'false') colorClass = "bg-gray-100 text-gray-500 border border-gray-200";
  
  return <span className={`px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-medium uppercase tracking-wider ${colorClass}`}>{children}</span>;
};

const ActionButtons = ({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) => (
  <div className="flex items-center gap-1 sm:gap-2">
    <button onClick={onEdit} className="p-1.5 text-gray-500 hover:text-sage-green hover:bg-sage-green/10 rounded-md transition-colors" title="Edit">
      <Edit2 size={16} />
    </button>
    <button onClick={onDelete} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
      <Trash2 size={16} />
    </button>
  </div>
);

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

  // Messages State
  const [messagePage, setMessagePage] = useState(1);
  const messagesPerPage = 10;
  
  // Modals
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form selections
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Consolidated Form Data
  const [formData, setFormData] = useState<any>({});

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
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  const closeModals = () => {
    setModalType(null);
    setEditingItem(null);
    setFormData({});
    setSelectedImage(null);
    setSelectedPdf(null);
    setImagePreview(null);
  };

  const openModal = (type: string, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({ ...item, benefits: Array.isArray(item.benefits) ? item.benefits.join(', ') : item.benefits });
      if (item.image) setImagePreview(item.image);
    } else {
      setFormData({});
    }
  };

  // CRUD Handlers
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalType === 'styles') {
        const payload = { ...formData, benefits: formData.benefits?.split(',').map((b: string) => b.trim()) || [] };
        if (editingItem) await updateStyle(editingItem.slug, payload, selectedImage);
        else await createStyle(payload, selectedImage);
      } else if (modalType === 'schedule') {
        if (editingItem) await updateSession(editingItem.id, formData);
        else await createSession(formData);
      } else if (modalType === 'programs') {
        if (editingItem) await updateProgram(editingItem.slug, formData, selectedImage, selectedPdf);
        else await createProgram(formData, selectedImage, selectedPdf);
      } else if (modalType === 'pricing') {
        const payload = { ...formData, benefits: formData.benefits?.split(',').map((b: string) => b.trim()) || [] };
        if (editingItem) await updatePricingPlan(editingItem.id, payload);
        else await createPricingPlan(payload);
      } else if (modalType === 'feedback') {
        if (editingItem) await updateFeedback(editingItem.id, formData, selectedImage);
        else await createFeedback(formData, selectedImage);
      } else if (modalType === 'blog') {
        if (editingItem) await updateBlogPost(editingItem.id, formData, selectedImage);
        else await createBlogPost(formData, selectedImage);
      }
      await fetchAllData();
      closeModals();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (type: string, item: any) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
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
    if (data.length === 0) return <EmptyState message={`No ${type} found.`} />;
    
    return (
      <TableWrapper>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
            <tr>
              <th className="px-6 py-4">Title/Name</th>
              {type === 'styles' && <th className="px-6 py-4">Difficulty</th>}
              {type === 'schedule' && <th className="px-6 py-4">Day/Time</th>}
              {type === 'schedule' && <th className="px-6 py-4">Instructor</th>}
              {type === 'programs' && <th className="px-6 py-4">Price</th>}
              {type === 'pricing' && <th className="px-6 py-4">Period</th>}
              {type === 'blog' && <th className="px-6 py-4">Status</th>}
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3 whitespace-nowrap">
                  {(item.image || item.image === "") && (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 shadow-sm">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={16} className="m-auto mt-3 text-gray-300" />}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{item.name || item.title || item.classType}</span>
                    {item.role && <span className="text-[10px] text-gray-400 font-bold uppercase">{item.role}</span>}
                  </div>
                </td>
                {type === 'styles' && <td className="px-6 py-4"><Badge type={item.difficulty}>{item.difficulty}</Badge></td>}
                {type === 'schedule' && <td className="px-6 py-4 text-xs text-gray-600 font-medium">{item.day} • {item.time}</td>}
                {type === 'schedule' && <td className="px-6 py-4 text-sm text-gray-500">{item.instructor}</td>}
                {type === 'programs' && <td className="px-6 py-4 font-bold text-deep-green">₹{item.price}</td>}
                {type === 'pricing' && <td className="px-6 py-4 text-sm text-gray-400">{item.period}</td>}
                {type === 'blog' && <td className="px-6 py-4"><Badge type={String(item.published)}>{item.published ? 'Published' : 'Draft'}</Badge></td>}
                <td className="px-6 py-4">
                  <ActionButtons onEdit={() => openModal(type, item)} onDelete={() => handleDelete(type, item)} />
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
      case 'styles':
        return (
          <DashboardSection title="Yoga Styles" description="Manage studio class types." onAdd={() => openModal('styles')}>
            {renderTable('styles', styles)}
          </DashboardSection>
        );
      case 'schedule':
        return (
          <DashboardSection title="Class Schedule" description="Manage weekly timetable." onAdd={() => openModal('schedule')}>
            {renderTable('schedule', scheduleData)}
          </DashboardSection>
        );
      case 'programs':
        return (
          <DashboardSection title="Curated Programs" description="Manage specialized courses." onAdd={() => openModal('programs')}>
            {renderTable('programs', programs)}
          </DashboardSection>
        );
      case 'pricing':
        return (
          <DashboardSection title="Membership Plans" description="Manage subscription tiers." onAdd={() => openModal('pricing')}>
            {renderTable('pricing', pricingPlansData)}
          </DashboardSection>
        );
      case 'feedback':
        return (
          <DashboardSection title="Testimonials" description="Manage student feedback." onAdd={() => openModal('feedback')}>
            {renderTable('feedback', feedback)}
          </DashboardSection>
        );
      case 'blog':
        return (
          <DashboardSection title="Wellness Blog" description="Manage journal entries." onAdd={() => openModal('blog')}>
            {renderTable('blog', blogPosts)}
          </DashboardSection>
        );
      case 'messages':
        const currentMessages = inquiries.slice((messagePage-1)*messagesPerPage, messagePage*messagesPerPage);
        return (
          <DashboardSection title="Contact Inquiries" description="Manage customer messages." hideAddButton={true}>
            {renderTable('inquiry', currentMessages)}
          </DashboardSection>
        );
      default:
        return <EmptyState message="Section missing." />;
    }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin text-sage-green" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex flex-col w-64 bg-deep-green text-white fixed top-0 left-0 h-screen z-[60] shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="flex flex-col items-start group">
            <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none">Meraki</span>
            <span className="font-sans text-[7px] tracking-[0.4em] font-bold uppercase mt-1 text-sage-green/60">ADMIN STUDIO</span>
          </Link>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {[
            { id: 'styles', label: 'Styles', icon: <Leaf size={20} /> },
            { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} /> },
            { id: 'programs', label: 'Programs', icon: <BookOpen size={20} /> },
            { id: 'pricing', label: 'Pricing', icon: <CreditCard size={20} /> },
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
            { id: 'feedback', label: 'Feedback', icon: <Quote size={20} /> },
            { id: 'blog', label: 'Blog', icon: <PenTool size={20} /> },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-sage-green text-deep-green shadow-lg' : 'text-gray-400 hover:text-white'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-300 hover:text-red-200"><LogOut size={18} /> Sign Out</button></div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden fixed w-full bg-deep-green text-white z-[60] flex justify-between items-center px-4 py-4 shadow-xl">
        <Link to="/" className="flex flex-col"><span className="font-serif text-xl font-bold">Meraki</span><span className="text-[6px] tracking-[0.3em] font-bold text-sage-green/60 uppercase">Admin</span></Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2"><Menu size={24} /></button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="lg:hidden fixed inset-y-0 left-0 w-[280px] bg-deep-green text-white z-[80] shadow-2xl flex flex-col p-6">
                <div className="flex justify-between items-center mb-8"><span className="font-serif text-2xl font-bold">Menu</span><button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button></div>
                <nav className="flex-1 space-y-2">
                    {['styles', 'schedule', 'programs', 'pricing', 'messages', 'feedback', 'blog'].map((id) => (
                        <button key={id} onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium ${activeTab === id ? 'bg-sage-green text-deep-green' : 'text-gray-400'}`}>
                           {id.charAt(0).toUpperCase() + id.slice(1)}
                        </button>
                    ))}
                </nav>
            </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12 pt-24 lg:pt-12 min-h-screen w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
            {renderContent()}
        </div>
      </main>

      {/* Universal Modal Content */}
      <Modal isOpen={!!modalType} onClose={closeModals} title={`${editingItem ? 'Edit' : 'Add New'} ${modalType}`}>
        <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {modalType === 'styles' && (
                    <>
                        <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Style Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" required /></div>
                        <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Description</label><textarea name="description" value={formData.description || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" rows={3} required /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Difficulty</label><select name="difficulty" value={formData.difficulty || 'Beginner'} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Duration</label><input type="text" name="duration" value={formData.duration || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="e.g. 60 min" /></div>
                        <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Benefits (comma separated)</label><input type="text" name="benefits" value={formData.benefits || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" /></div>
                    </>
                )}

                {modalType === 'schedule' && (
                    <>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Day</label><select name="day" value={formData.day || 'Monday'} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none"><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option></select></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Time</label><input type="text" name="time" value={formData.time || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="e.g. 07:00 AM" required /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Class Type</label><input type="text" name="classType" value={formData.classType || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" required /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Instructor</label><input type="text" name="instructor" value={formData.instructor || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" required /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Location</label><input type="text" name="location" value={formData.location || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Level</label><input type="text" name="level" value={formData.level || 'All Levels'} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" /></div>
                    </>
                )}

                {modalType === 'programs' && (
                    <>
                        <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Program Title</label><input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" required /></div>
                        <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Description</label><textarea name="description" value={formData.description || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" rows={2} required /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Price (₹)</label><input type="number" name="price" value={formData.price || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" required /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Level</label><input type="text" name="level" value={formData.level || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Duration</label><input type="text" name="duration" value={formData.duration || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Badge (Optional)</label><input type="text" name="badge" value={formData.badge || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" /></div>
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">Brochure PDF</label>
                          <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'pdf')} className="hidden" id="pdf-upload" />
                          <label htmlFor="pdf-upload" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-100">
                             <FileText size={18} /> {selectedPdf ? selectedPdf.name : (formData.pdf_url ? 'PDF Attached' : 'Upload PDF')}
                          </label>
                        </div>
                    </>
                )}

                {modalType === 'pricing' && (
                    <>
                        <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Plan Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" required /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Price</label><input type="text" name="price" value={formData.price || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" required /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Period</label><input type="text" name="period" value={formData.period || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="e.g. per month" required /></div>
                        <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Benefits (comma separated)</label><textarea name="benefits" value={formData.benefits || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" rows={2} /></div>
                        <div className="flex items-center gap-3"><input type="checkbox" name="highlight" checked={formData.highlight || false} onChange={handleFormChange} id="highlight" /><label htmlFor="highlight" className="text-sm text-gray-600">Highlight as Best Value</label></div>
                    </>
                )}

                {modalType === 'feedback' && (
                    <>
                        <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Student Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" required /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Role/Subtitle</label><input type="text" name="role" value={formData.role || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="e.g. Member since 2021" /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Rating (1-5)</label><input type="number" name="rating" min="1" max="5" value={formData.rating || 5} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" /></div>
                        <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Quote</label><textarea name="quote" value={formData.quote || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" rows={3} required /></div>
                    </>
                )}

                {modalType === 'blog' && (
                    <>
                        <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Post Title</label><input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" required /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Slug</label><input type="text" name="slug" value={formData.slug || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="auto-generated-if-empty" /></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Category</label><input type="text" name="category" value={formData.category || 'Wellness'} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" /></div>
                        <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Excerpt</label><textarea name="excerpt" value={formData.excerpt || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" rows={2} /></div>
                        <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Content</label><textarea name="content" value={formData.content || ''} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none font-mono text-sm" rows={6} required /></div>
                        <div className="flex items-center gap-3"><input type="checkbox" name="published" checked={formData.published || false} onChange={handleFormChange} id="published" /><label htmlFor="published" className="text-sm text-gray-600">Publish Immediately</label></div>
                    </>
                )}

                {/* Shared Image Upload UI */}
                {['styles', 'programs', 'feedback', 'blog'].includes(modalType as string) && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Cover Image</label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-gray-50 border overflow-hidden shrink-0 flex items-center justify-center">
                        {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" />}
                      </div>
                      <div className="flex-1">
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} className="hidden" id="img-upload" />
                        <label htmlFor="img-upload" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload size={18} /> Select New Image
                        </label>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={closeModals} className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-deep-green text-white rounded-xl font-medium hover:bg-opacity-90 transition-all flex items-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingItem ? 'Update' : 'Create')}
                </button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;