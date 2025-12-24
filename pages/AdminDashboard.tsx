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
  MessageSquare,
  Upload,
  Star,
  Quote,
  ShieldCheck
} from 'lucide-react';
// @ts-ignore
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
const motion = framerMotion as any;

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
        <div className="p-5 sm:p-6">{children}</div>
      </motion.div>
    </div>
  );
};

const DashboardSection = ({ title, description, onAdd, children, hideAddButton }: any) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="text-left">
        <h2 className="font-serif text-2xl sm:text-3xl text-deep-green">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
      {!hideAddButton && (
          <button onClick={onAdd} className="bg-sage-green text-white px-4 py-2.5 rounded-lg font-medium hover:bg-deep-green transition-all flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center">
            <Plus size={18} /> Add New
          </button>
      )}
    </div>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">{children}</div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('styles');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [styles, setStyles] = useState<YogaStyle[]>([]);
  const [scheduleData, setScheduleData] = useState<ClassSession[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [programs, setPrograms] = useState<Course[]>([]);
  const [pricingPlansData, setPricingPlansData] = useState<PricingPlan[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);

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

  const handleLogout = async () => { 
    if(window.confirm('Are you sure you want to log out?')) {
        await supabase.auth.signOut(); 
        navigate('/admin'); 
    }
  };

  const navItems = [
    { id: 'styles', label: 'Yoga Styles', icon: <Leaf size={20} /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} /> },
    { id: 'programs', label: 'Programs', icon: <BookOpen size={20} /> },
    { id: 'pricing', label: 'Pricing', icon: <CreditCard size={20} /> },
    { id: 'messages', label: 'Inquiries', icon: <MessageSquare size={20} /> },
    { id: 'feedback', label: 'Feedback', icon: <Quote size={20} /> },
    { id: 'blog', label: 'Blog', icon: <PenTool size={20} /> },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-deep-green text-white">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
        <Link to="/" className="font-serif text-2xl font-bold flex items-center gap-2">
          <ShieldCheck size={28} className="text-sage-green" />
          <span className="tracking-tight">Meraki Admin</span>
        </Link>
        {isMobile && (
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-white">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Navigation Area - Scrollable */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto hide-scrollbar">
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => { setActiveTab(item.id); if(isMobile) setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all text-left ${activeTab === item.id ? 'bg-white/10 text-white font-bold ring-1 ring-white/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            {item.icon} <span className="flex-1">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Pinned Logout Button Section - Fixed at bottom */}
      <div className="p-6 border-t border-white/10 bg-black/10 shrink-0">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-lg active:scale-95 border border-red-500/50"
        >
          <LogOut size={20} /> <span>LOG OUT</span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
      const sectionProps = {
          styles: { title: "Yoga Styles", desc: "Manage studio class types.", onAdd: () => setModalType('styles'), data: styles },
          schedule: { title: "Schedule", desc: "Manage class timetable.", onAdd: () => setModalType('schedule'), data: scheduleData },
          programs: { title: "Programs", desc: "Manage curated courses.", onAdd: () => setModalType('programs'), data: programs },
          pricing: { title: "Pricing", desc: "Manage membership tiers.", onAdd: () => setModalType('pricing'), data: pricingPlansData },
          feedback: { title: "Feedback", desc: "Manage student testimonials.", onAdd: () => setModalType('feedback'), data: feedback },
          blog: { title: "Blog", desc: "Manage wellness articles.", onAdd: () => setModalType('blog'), data: blogPosts },
          messages: { title: "Inquiries", desc: "Client messages.", hideAddButton: true, data: inquiries }
      }[activeTab as keyof typeof sectionProps];

      if (!sectionProps) return null;

      return (
          <DashboardSection {...sectionProps}>
              <div className="p-12 text-center text-gray-400">
                  <Database size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Content for {activeTab} section will be displayed here.</p>
                  <p className="text-xs mt-2 italic">Database contains {sectionProps.data?.length || 0} items.</p>
              </div>
          </DashboardSection>
      );
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin text-sage-green" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Mobile Header (Hidden on Laptop/Desktop) */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-deep-green text-white fixed top-0 w-full z-[80] shadow-md h-[64px]">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <Menu size={24} />
        </button>
        <div className="font-serif text-xl font-bold tracking-tight">Meraki Admin</div>
        <button onClick={handleLogout} className="p-2 -mr-2 text-red-400 hover:text-red-300">
          <LogOut size={24} />
        </button>
      </header>

      {/* Persistent Desktop Sidebar */}
      <aside className="hidden md:block w-72 fixed inset-y-0 left-0 z-40 border-r border-gray-100 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-[100]">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)} 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.aside 
              initial={{ x: -300 }} 
              animate={{ x: 0 }} 
              exit={{ x: -300 }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 w-[300px] h-full shadow-2xl"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 min-h-screen flex flex-col">
        {/* Desktop Header - Secondary Logout & Profile */}
        <div className="hidden md:flex items-center justify-between px-10 py-5 bg-white border-b border-gray-100 sticky top-0 z-30">
            <h1 className="font-serif text-2xl text-deep-green capitalize">{activeTab}</h1>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-sage-green/20 flex items-center justify-center text-sage-green font-bold text-xs">A</div>
                    <span className="text-sm font-medium text-gray-700">Administrator</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-full transition-all border border-red-100 shadow-sm"
                >
                  <LogOut size={18} /> Logout
                </button>
            </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 md:p-10 pt-24 md:pt-10">
            <div className="max-w-6xl mx-auto">
                {renderContent()}
            </div>
        </div>
      </main>

      {/* Form Modal (Placeholder structure) */}
      <Modal isOpen={!!modalType} onClose={() => setModalType(null)} title={`${editingItem ? 'Edit' : 'Add'} ${modalType}`}>
        <p className="text-gray-500 mb-6">Form fields for {modalType} will go here.</p>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={() => setModalType(null)} className="px-4 py-2 text-gray-400 hover:text-gray-600">Cancel</button>
          <button className="bg-deep-green text-white px-6 py-2 rounded-xl">Save Changes</button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;