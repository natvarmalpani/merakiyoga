import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from '../services/dataService.ts';
import { supabase } from '../services/supabaseClient.ts';
import { getStyles, createStyle, updateStyle, deleteStyle } from '../services/styleService.ts';
import { getSchedule, createSession, updateSession, deleteSession } from '../services/scheduleService.ts';
import { getInquiries, createInquiry, deleteInquiry } from '../services/contactService.ts';
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
  Trash2,
  Edit2,
  Loader2,
  MessageSquare,
  ShieldCheck,
  User as UserIcon,
  CheckSquare,
  Square,
  Trash,
  Quote,
  Clock,
  MapPin,
  Phone,
  Image as ImageIcon,
  FileText
} from 'lucide-react';

// @ts-ignore
import * as framerMotion from 'framer-motion';

const motion = (framerMotion as any).motion || {
  div: ({ children, className, style, onClick }: any) => <div className={className} style={style} onClick={onClick}>{children}</div>
};
const AnimatePresence = (framerMotion as any).AnimatePresence || (({ children }: any) => <>{children}</>);

// --- Shared Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e: any) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-serif text-2xl font-medium text-deep-green">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
};

const DashboardSection = ({ title, description, onAdd, children, hideAddButton, bulkActions }: any) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="text-left">
        <h2 className="font-serif text-2xl sm:text-3xl text-deep-green">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {bulkActions}
        {!hideAddButton && (
            <button onClick={onAdd} className="bg-sage-green text-white px-5 py-2.5 rounded-xl font-bold hover:bg-deep-green transition-all flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center uppercase tracking-widest text-xs">
              <Plus size={18} /> Add New
            </button>
        )}
      </div>
    </div>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">{children}</div>
  </div>
);

const TableHeader = ({ cols, labels }: { cols: string[], labels: string[] }) => (
  <div className="grid gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400" style={{ gridTemplateColumns: cols.join(' ') }}>
    {labels.map((label, i) => <div key={i}>{label}</div>)}
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('styles');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Data State
  const [styles, setStyles] = useState<YogaStyle[]>([]);
  const [scheduleData, setScheduleData] = useState<ClassSession[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [programs, setPrograms] = useState<Course[]>([]);
  const [pricingPlansData, setPricingPlansData] = useState<PricingPlan[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);

  // Selection State
  const [selectedInquiryIds, setSelectedInquiryIds] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState<any>({});
  const [fileData, setFileData] = useState<{ [key: string]: File | null }>({ image: null, pdf: null });

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

  const resetForm = () => {
    setEditingItem(null);
    setFormData({});
    setFileData({ image: null, pdf: null });
    setModalType(null);
  };

  const handleEdit = (type: string, item: any) => {
    setModalType(type);
    setEditingItem(item);
    
    // Convert benefits array to comma-string for easy editing
    const initialData = { ...item };
    if (initialData.benefits && Array.isArray(initialData.benefits)) {
        initialData.benefits_str = initialData.benefits.join(', ');
    }
    setFormData(initialData);
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      setFileData(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData };
      if (payload.benefits_str) {
          payload.benefits = payload.benefits_str.split(',').map((s: string) => s.trim()).filter(Boolean);
          delete payload.benefits_str;
      }

      switch (modalType) {
        case 'styles':
          if (editingItem) await updateStyle(editingItem.slug, payload, fileData.image);
          else await createStyle(payload, fileData.image);
          break;
        case 'schedule':
          if (editingItem) await updateSession(editingItem.id, payload);
          else await createSession(payload);
          break;
        case 'programs':
          if (editingItem) await updateProgram(editingItem.slug, payload, fileData.image, fileData.pdf);
          else await createProgram(payload, fileData.image, fileData.pdf);
          break;
        case 'pricing':
          if (editingItem) await updatePricingPlan(editingItem.id, payload);
          else await createPricingPlan(payload);
          break;
        case 'blog':
          if (editingItem) await updateBlogPost(editingItem.id, payload, fileData.image);
          else await createBlogPost(payload, fileData.image);
          break;
        case 'feedback':
          if (editingItem) await updateFeedback(editingItem.id, payload, fileData.image);
          else await createFeedback(payload, fileData.image);
          break;
        case 'messages':
          // Inquiries usually aren't edited but let's allow "Create"
          await createInquiry(payload);
          break;
      }
      await fetchAllData();
      resetForm();
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Nav Items ---
  const navItems = [
    { id: 'styles', label: 'Yoga Styles', icon: <Leaf size={20} /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} /> },
    { id: 'programs', label: 'Programs', icon: <BookOpen size={20} /> },
    { id: 'pricing', label: 'Pricing', icon: <CreditCard size={20} /> },
    { id: 'messages', label: 'Inquiries', icon: <MessageSquare size={20} /> },
    { id: 'feedback', label: 'Feedback', icon: <Quote size={20} /> },
    { id: 'blog', label: 'Blog', icon: <PenTool size={20} /> },
  ];

  const renderFormFields = () => {
    const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-green outline-none transition-all text-sm";
    const labelClass = "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2";

    switch (modalType) {
      case 'styles':
        return (
          <div className="space-y-4 text-left">
            <div>
              <label className={labelClass}>Style Name</label>
              <input name="name" value={formData.name || ''} onChange={handleInputChange} className={inputClass} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Difficulty</label>
                <select name="difficulty" value={formData.difficulty || 'Beginner'} onChange={handleInputChange} className={inputClass}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Duration</label>
                <input name="duration" value={formData.duration || ''} onChange={handleInputChange} className={inputClass} placeholder="e.g. 60 min" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" value={formData.description || ''} onChange={handleInputChange} className={inputClass} rows={3} required />
            </div>
            <div>
              <label className={labelClass}>Benefits (Comma separated)</label>
              <input name="benefits_str" value={formData.benefits_str || ''} onChange={handleInputChange} className={inputClass} placeholder="Flexibility, Calm, Strength" />
            </div>
            <div>
              <label className={labelClass}>Style Image</label>
              <input type="file" onChange={(e) => handleFileChange(e, 'image')} className="text-xs" accept="image/*" />
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Day</label>
                <select name="day" value={formData.day || 'Monday'} onChange={handleInputChange} className={inputClass}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Time</label>
                <input name="time" value={formData.time || ''} onChange={handleInputChange} className={inputClass} placeholder="07:00 AM" required />
              </div>
            </div>
            <div>
              <label className={labelClass}>Class Type</label>
              <input name="classType" value={formData.classType || ''} onChange={handleInputChange} className={inputClass} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Instructor</label>
                <input name="instructor" value={formData.instructor || ''} onChange={handleInputChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Level</label>
                <input name="level" value={formData.level || ''} onChange={handleInputChange} className={inputClass} placeholder="Open, Intermediate" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input name="location" value={formData.location || ''} onChange={handleInputChange} className={inputClass} placeholder="Studio A" />
            </div>
          </div>
        );

      case 'programs':
        return (
          <div className="space-y-4 text-left">
            <div>
              <label className={labelClass}>Program Title</label>
              <input name="title" value={formData.title || ''} onChange={handleInputChange} className={inputClass} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Level</label>
                <input name="level" value={formData.level || ''} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Duration</label>
                <input name="duration" value={formData.duration || ''} onChange={handleInputChange} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price (INR)</label>
                <input type="number" name="price" value={formData.price || ''} onChange={handleInputChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Badge</label>
                <input name="badge" value={formData.badge || ''} onChange={handleInputChange} className={inputClass} placeholder="Best Seller" />
              </div>
            </div>
            <div>
                <label className={labelClass}>Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleInputChange} className={inputClass} rows={2} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Thumbnail Image</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'image')} className="text-xs" accept="image/*" />
                </div>
                <div>
                  <label className={labelClass}>Program PDF (Brochure)</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'pdf')} className="text-xs" accept="application/pdf" />
                </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
            <div className="space-y-4 text-left">
                <div>
                  <label className={labelClass}>Plan Name</label>
                  <input name="name" value={formData.name || ''} onChange={handleInputChange} className={inputClass} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Price Label</label>
                    <input name="price" value={formData.price || ''} onChange={handleInputChange} className={inputClass} placeholder="₹500" required />
                  </div>
                  <div>
                    <label className={labelClass}>Period</label>
                    <input name="period" value={formData.period || ''} onChange={handleInputChange} className={inputClass} placeholder="per class / month" required />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Benefits (Comma separated)</label>
                  <textarea name="benefits_str" value={formData.benefits_str || ''} onChange={handleInputChange} className={inputClass} rows={3} placeholder="Feature 1, Feature 2" required />
                </div>
                <div className="flex items-center gap-3">
                    <input type="checkbox" id="highlight" name="highlight" checked={formData.highlight || false} onChange={handleInputChange} className="w-5 h-5 rounded text-sage-green focus:ring-sage-green" />
                    <label htmlFor="highlight" className="text-sm text-gray-600 font-bold uppercase tracking-widest">Highlight as Best Value</label>
                </div>
            </div>
        );

      case 'blog':
        return (
          <div className="space-y-4 text-left">
            <div>
              <label className={labelClass}>Article Title</label>
              <input name="title" value={formData.title || ''} onChange={handleInputChange} className={inputClass} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category</label>
                  <input name="category" value={formData.category || ''} onChange={handleInputChange} className={inputClass} placeholder="Wellness" required />
                </div>
                <div>
                    <label className={labelClass}>Featured Image</label>
                    <input type="file" onChange={(e) => handleFileChange(e, 'image')} className="text-xs mt-1" accept="image/*" />
                </div>
            </div>
            <div>
              <label className={labelClass}>Short Excerpt</label>
              <textarea name="excerpt" value={formData.excerpt || ''} onChange={handleInputChange} className={inputClass} rows={2} required />
            </div>
            <div>
              <label className={labelClass}>Full Content</label>
              <textarea name="content" value={formData.content || ''} onChange={handleInputChange} className={inputClass} rows={8} required />
            </div>
            <div className="flex items-center gap-3">
                <input type="checkbox" id="published" name="published" checked={formData.published || false} onChange={handleInputChange} className="w-5 h-5 rounded text-sage-green focus:ring-sage-green" />
                <label htmlFor="published" className="text-sm text-gray-600 font-bold uppercase tracking-widest">Publish Live</label>
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Customer Name</label>
                  <input name="name" value={formData.name || ''} onChange={handleInputChange} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Role/Tag</label>
                  <input name="role" value={formData.role || ''} onChange={handleInputChange} className={inputClass} placeholder="Student since 2022" required />
                </div>
            </div>
            <div>
              <label className={labelClass}>Rating (1-5)</label>
              <input type="number" name="rating" min="1" max="5" value={formData.rating || 5} onChange={handleInputChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Testimonial Quote</label>
              <textarea name="quote" value={formData.quote || ''} onChange={handleInputChange} className={inputClass} rows={3} required />
            </div>
            <div>
                <label className={labelClass}>Avatar Image</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'image')} className="text-xs" accept="image/*" />
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input name="first_name" value={formData.first_name || ''} onChange={handleInputChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input name="last_name" value={formData.last_name || ''} onChange={handleInputChange} className={inputClass} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input name="phone_number" value={formData.phone_number || ''} onChange={handleInputChange} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Type/Subject</label>
              <input name="inquiry_type" value={formData.inquiry_type || 'General Inquiry'} onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Message</label>
              <textarea name="message" value={formData.message || ''} onChange={handleInputChange} className={inputClass} rows={4} required />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const ActionButtons = ({ item, type, onDelete }: any) => (
    <div className="flex justify-end gap-1">
      <button 
        onClick={() => handleEdit(type, item)} 
        className="p-2 text-gray-400 hover:text-deep-green hover:bg-gray-100 rounded-lg transition-all" 
        title="Edit"
      >
        <Edit2 size={16} />
      </button>
      <button 
        onClick={onDelete} 
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  const renderContent = () => {
      switch (activeTab) {
          case 'styles':
              return (
                <DashboardSection title="Yoga Styles" description="Manage studio class types." onAdd={() => setModalType('styles')}>
                   <div className="overflow-x-auto">
                     <div className="min-w-[800px]">
                       <TableHeader cols={['80px', '200px', '150px', '1fr', '100px']} labels={['Image', 'Style Name', 'Difficulty', 'Description', 'Action']} />
                       <div className="divide-y divide-gray-50">
                         {styles.map(style => (
                           <div key={style.slug} className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 text-sm" style={{ gridTemplateColumns: '80px 200px 150px 1fr 100px' }}>
                             <img src={style.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                             <div className="font-bold text-gray-900">{style.name}</div>
                             <div>
                               <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${style.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : style.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>
                                 {style.difficulty}
                               </span>
                             </div>
                             <div className="text-gray-500 truncate">{style.description}</div>
                             <ActionButtons item={style} type="styles" onDelete={() => deleteStyle(style.slug, style.image).then(fetchAllData)} />
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </DashboardSection>
              );

          case 'schedule':
              return (
                <DashboardSection title="Schedule" description="Manage weekly timetable." onAdd={() => setModalType('schedule')}>
                   <div className="overflow-x-auto">
                     <div className="min-w-[800px]">
                       <TableHeader cols={['120px', '120px', '200px', '150px', '1fr', '100px']} labels={['Day', 'Time', 'Class', 'Instructor', 'Location', 'Action']} />
                       <div className="divide-y divide-gray-50">
                         {scheduleData.map(session => (
                           <div key={session.id} className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 text-sm" style={{ gridTemplateColumns: '120px 120px 200px 150px 1fr 100px' }}>
                             <div className="font-medium text-sage-green flex items-center gap-2"><Calendar size={14} />{session.day}</div>
                             <div className="text-gray-600 flex items-center gap-2"><Clock size={14} />{session.time}</div>
                             <div className="font-bold text-deep-green">{session.classType}</div>
                             <div className="text-gray-600 flex items-center gap-2"><UserIcon size={14} />{session.instructor}</div>
                             <div className="text-gray-500 text-xs flex items-center gap-2"><MapPin size={14} />{session.location}</div>
                             <ActionButtons item={session} type="schedule" onDelete={() => deleteSession(session.id).then(fetchAllData)} />
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </DashboardSection>
              );

          case 'programs':
              return (
                <DashboardSection title="Programs" description="Manage structured courses." onAdd={() => setModalType('programs')}>
                   <div className="overflow-x-auto">
                     <div className="min-w-[800px]">
                       <TableHeader cols={['80px', '200px', '120px', '120px', '1fr', '100px']} labels={['Image', 'Title', 'Level', 'Price', 'Description', 'Action']} />
                       <div className="divide-y divide-gray-50">
                         {programs.map(prog => (
                           <div key={prog.slug} className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 text-sm" style={{ gridTemplateColumns: '80px 200px 120px 120px 1fr 100px' }}>
                             <img src={prog.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-100 shadow-sm" />
                             <div className="font-bold text-gray-900">{prog.title}</div>
                             <div className="text-gray-600 font-medium">{prog.level}</div>
                             <div className="font-mono font-bold text-sage-green">₹{prog.price}</div>
                             <div className="text-gray-500 truncate">{prog.description}</div>
                             <ActionButtons item={prog} type="programs" onDelete={() => deleteProgram(prog.slug).then(fetchAllData)} />
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </DashboardSection>
              );

          case 'pricing':
              return (
                <DashboardSection title="Pricing" description="Manage membership plans." onAdd={() => setModalType('pricing')}>
                   <div className="overflow-x-auto">
                     <div className="min-w-[800px]">
                       <TableHeader cols={['200px', '150px', '150px', '1fr', '100px']} labels={['Plan Name', 'Price', 'Period', 'Benefits', 'Action']} />
                       <div className="divide-y divide-gray-50">
                         {pricingPlansData.map(plan => (
                           <div key={plan.id} className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 text-sm" style={{ gridTemplateColumns: '200px 150px 150px 1fr 100px' }}>
                             <div className="font-bold text-gray-900 flex items-center gap-2">
                                {plan.highlight && <span className="w-2.5 h-2.5 rounded-full bg-sage-green" title="Highlighted"></span>}
                                {plan.name}
                             </div>
                             <div className="font-mono font-bold text-sage-green">{plan.price}</div>
                             <div className="text-gray-500 font-medium">{plan.period}</div>
                             <div className="flex gap-2 flex-wrap">
                                {plan.benefits.slice(0, 2).map((b, i) => <span key={i} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold uppercase tracking-wider">{b}</span>)}
                                {plan.benefits.length > 2 && <span className="text-[10px] text-gray-300 font-black">+{plan.benefits.length - 2}</span>}
                             </div>
                             <ActionButtons item={plan} type="pricing" onDelete={() => deletePricingPlan(plan.id).then(fetchAllData)} />
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </DashboardSection>
              );

          case 'feedback':
              return (
                <DashboardSection title="Feedback" description="Manage customer testimonials." onAdd={() => setModalType('feedback')}>
                   <div className="overflow-x-auto">
                     <div className="min-w-[800px]">
                       <TableHeader cols={['60px', '180px', '150px', '1fr', '100px']} labels={['Image', 'Customer', 'Rating', 'Testimonial', 'Action']} />
                       <div className="divide-y divide-gray-50">
                         {feedback.map(item => (
                           <div key={item.id} className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 text-sm" style={{ gridTemplateColumns: '60px 180px 150px 1fr 100px' }}>
                             <img src={item.image || 'https://picsum.photos/100'} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100 ring-2 ring-white shadow-sm" />
                             <div>
                               <div className="font-bold text-gray-900">{item.name}</div>
                               <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.role}</div>
                             </div>
                             <div className="flex text-yellow-400 text-xs gap-0.5">
                                {'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}
                             </div>
                             <div className="text-gray-600 italic truncate font-light">"{item.quote}"</div>
                             <ActionButtons item={item} type="feedback" onDelete={() => deleteFeedback(item.id).then(fetchAllData)} />
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </DashboardSection>
              );

          case 'blog':
              return (
                <DashboardSection title="Blog" description="Manage articles and posts." onAdd={() => setModalType('blog')}>
                   <div className="overflow-x-auto">
                     <div className="min-w-[800px]">
                       <TableHeader cols={['80px', '1fr', '120px', '100px', '100px']} labels={['Image', 'Title', 'Date', 'Status', 'Action']} />
                       <div className="divide-y divide-gray-50">
                         {blogPosts.map(post => (
                           <div key={post.id} className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 text-sm" style={{ gridTemplateColumns: '80px 1fr 120px 100px 100px' }}>
                             <img src={post.image || 'https://picsum.photos/100'} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                             <div>
                                <div className="font-bold text-gray-900 line-clamp-1">{post.title}</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(post.created_at).toLocaleDateString()}</div>
                             </div>
                             <div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                  {post.published ? 'Published' : 'Draft'}
                                </span>
                             </div>
                             <div className="text-gray-400 font-bold text-[10px] text-center uppercase tracking-widest">{post.likes} Likes</div>
                             <ActionButtons item={post} type="blog" onDelete={() => deleteBlogPost(post.id).then(fetchAllData)} />
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </DashboardSection>
              );

          case 'messages':
              return (
                <DashboardSection title="Inquiries" description="Member messages and bookings." onAdd={() => setModalType('messages')}
                  bulkActions={selectedInquiryIds.length > 0 && (
                      <button onClick={async () => { if(window.confirm('Delete selected?')) { await Promise.all(selectedInquiryIds.map(deleteInquiry)); await fetchAllData(); setSelectedInquiryIds([]); }}} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-100 border border-red-200 transition-all">
                        <Trash size={16} /> Delete ({selectedInquiryIds.length})
                      </button>
                    )}
                >
                  <div className="overflow-x-auto">
                    <div className="min-w-[900px]">
                      <TableHeader cols={['40px', '100px', '140px', '160px', '120px', '100px', '1fr', '80px']} labels={['', 'Date', 'Name', 'Email', 'Phone', 'Type', 'Message', 'Action']} />
                      <div className="divide-y divide-gray-50">
                        {inquiries.map((inq) => (
                          <div key={inq.id} className={`grid gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors text-sm ${selectedInquiryIds.includes(inq.id) ? 'bg-sage-green/5' : ''}`} style={{ gridTemplateColumns: '40px 100px 140px 160px 120px 100px 1fr 80px' }}>
                            <button onClick={() => setSelectedInquiryIds(p => p.includes(inq.id) ? p.filter(i => i !== inq.id) : [...p, inq.id])} className="text-gray-300 hover:text-sage-green transition-colors">
                              {selectedInquiryIds.includes(inq.id) ? <CheckSquare size={20} className="text-sage-green" /> : <Square size={20} />}
                            </button>
                            <div className="text-gray-400 font-mono text-[10px]">{new Date(inq.created_at).toLocaleDateString()}</div>
                            <div className="font-bold text-gray-900 truncate">{inq.first_name} {inq.last_name}</div>
                            <div className="text-xs text-gray-500 truncate">{inq.email}</div>
                            <div className="text-xs text-gray-500 truncate flex items-center gap-1">{inq.phone_number ? <><Phone size={10} className="text-sage-green"/> {inq.phone_number}</> : '-'}</div>
                            <div><span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-black uppercase text-gray-400 tracking-tighter truncate block text-center">{inq.inquiry_type || 'General'}</span></div>
                            <div className="text-gray-600 line-clamp-1 italic text-xs">"{inq.message}"</div>
                            <ActionButtons item={inq} type="messages" onDelete={() => deleteInquiry(inq.id).then(fetchAllData)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </DashboardSection>
              );
          
          default: return null;
      }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin text-sage-green" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-deep-green text-white fixed top-0 w-full z-[80] shadow-md h-[64px]">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 hover:bg-white/10 rounded-lg"><Menu size={24} /></button>
        <div className="font-serif text-xl font-bold tracking-tight">Meraki Admin</div>
        <div className="w-8"></div>
      </header>

      <aside className="hidden md:block w-72 fixed inset-y-0 left-0 z-40 border-r border-gray-100 bg-deep-green overflow-hidden">
        {/* Reuse sidebar content */}
        <div className="flex flex-col h-full bg-deep-green text-white">
          <div className="p-6 border-b border-white/10 flex items-center shrink-0">
            <Link to="/" className="font-serif text-2xl font-bold flex items-center gap-2">
              <ShieldCheck size={28} className="text-sage-green" />
              <span className="tracking-tight">Meraki Admin</span>
            </Link>
          </div>
          <nav className="flex-1 min-h-0 py-8 px-4 space-y-2 overflow-y-auto">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-left ${activeTab === item.id ? 'bg-white/10 text-white ring-1 ring-white/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
          <div className="p-6 border-t border-white/5">
             <button onClick={() => { if(window.confirm('Logout?')) { supabase.auth.signOut().then(() => navigate('/admin')); }}} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-[10px] font-black text-white bg-red-600/90 rounded-2xl transition-all shadow-lg active:scale-95 border border-red-500/30 uppercase tracking-[0.2em]">
               <LogOut size={18} /> LOG OUT
             </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 min-h-screen flex flex-col">
        <div className="hidden md:flex items-center justify-between px-10 py-5 bg-white border-b border-gray-100 sticky top-0 z-30">
            <h1 className="font-serif text-2xl text-deep-green capitalize">{activeTab}</h1>
            <div className="flex items-center gap-4 bg-gray-50 px-5 py-2 rounded-full border border-gray-100">
                <UserIcon size={16} className="text-sage-green" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Studio Manager</span>
            </div>
        </div>

        <div className="flex-1 p-6 md:p-10 pt-24 md:pt-10">
            <div className="max-w-6xl mx-auto">
                {renderContent()}
            </div>
        </div>
      </main>

      <Modal isOpen={!!modalType} onClose={resetForm} title={`${editingItem ? 'Edit' : 'Add'} ${activeTab === 'messages' ? 'Inquiry' : activeTab.slice(0, -1)}`}>
        <form onSubmit={handleSave} className="space-y-6">
            {renderFormFields()}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-50 mt-8">
              <button type="button" onClick={resetForm} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-deep-green text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-opacity-90 active:scale-95 disabled:opacity-50">
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <CheckSquare size={16} />}
                {editingItem ? 'Update Changes' : 'Create Record'}
              </button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;